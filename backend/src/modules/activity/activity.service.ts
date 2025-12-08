import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeDocument } from './schema/like.schema';
import { isValidObjectId, Model, Types } from 'mongoose';
import { Blog, BlogDocument } from '../blog/schema/blog.schema';
import { Save, SaveDocument } from './schema/save.schema';
import { Archive, ArchiveDocument } from './schema/archive.schema';
import { WsService } from 'src/web-socket/web-socket.service';
import { User, UserDocument } from '../user/schema/user.schema';
import { NotificationDocument, TNotification, Notification } from './schema/notification.schema';

@Injectable()
export class ActivityService {
  constructor(
    @InjectModel(Like.name) private readonly likeModel: Model<LikeDocument>,
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
    @InjectModel(Save.name) private readonly saveModel: Model<SaveDocument>,
    @InjectModel(Archive.name) private readonly archiveModel: Model<ArchiveDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Notification.name) private readonly notificationModel: Model<NotificationDocument>,
    private readonly wsService: WsService
  ) {}

  async createLike(authorId: string, blogId: string):Promise<boolean>{
    if(!isValidObjectId(authorId) || !isValidObjectId(blogId)){
      throw new BadRequestException({
        msg: 'Invalid Author or Blog ID.',
        code: 'INVALID_ID'
      })
    }

    try {
      const isBlog = await this.blogModel.findById(blogId)

      if(!isBlog){
        throw new NotFoundException({
          msg: 'Blog not found.',
          code: 'NOT_FOUND'
        })
      }

      const activityUser = await this.userModel.findById(authorId)

      const isAlreadyLiked = await this.likeModel.deleteOne({
        author: authorId,
        blogId
      }).exec()

      if(!isAlreadyLiked && authorId != isBlog.author.toString()){
        this.wsService.emitToUser(`user:${isBlog.author}`, 'newNotification', {
          likedBy: activityUser?.username,
          blog: isBlog
        })

        await this.notificationModel.create({
          author: new Types.ObjectId(isBlog.author),
          likedBy: new Types.ObjectId(authorId),
          blogId: new Types.ObjectId(blogId)
        })
      }

      if(isAlreadyLiked.deletedCount <= 0){
        await this.likeModel.create({
          author: new Types.ObjectId(authorId),
          blogId: new Types.ObjectId(blogId)
        })

        await this.notificationModel.deleteOne({
          likedBy: authorId,
          blogId
        })
        
        return true;
      }
      
      return false;
    } catch (error) {
      if(error instanceof BadRequestException || error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException({
        msg: 'Internal Server Error.',
        code: 'INTERNAL_SERVER_ERROR',
        error
      })
    }
  }

  async saveBlog(authorId: string, blogId: string):Promise<boolean>{
    if(!isValidObjectId(authorId) || !isValidObjectId(blogId)){
      throw new BadRequestException({
        msg: 'Invalid Author or Blog ID.',
        code: 'INVALID_ID'
      })
    }

    try {
      const isBlog = await this.blogModel.exists({_id: blogId})

      if(!isBlog){
        throw new NotFoundException({
          msg: 'Blog not found.',
          code: 'NOT_FOUND'
        })
      }

      const isAlreadySaved = await this.saveModel.deleteOne({
        author: authorId,
        blogId
      }).exec()

      if(isAlreadySaved.deletedCount <= 0){
        await this.saveModel.create({
          author: new Types.ObjectId(authorId),
          blogId: new Types.ObjectId(blogId)
        })

        return true;
      }
      
      return false;
    } catch (error) {
      if(error instanceof BadRequestException || error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException({
        msg: 'Internal Server Error.',
        code: 'INTERNAL_SERVER_ERROR',
        error
      })
    }
  }

  async archiveBlog(authorId: string, blogId: string):Promise<boolean>{
    if(!isValidObjectId(authorId) || !isValidObjectId(blogId)){
      throw new BadRequestException({
        msg: 'Invalid Author or Blog ID.',
        code: 'INVALID_ID'
      })
    }

    try {
      const isBlog = await this.blogModel.exists({_id: blogId})

      if(!isBlog){
        throw new NotFoundException({
          msg: 'Blog not found.',
          code: 'NOT_FOUND'
        })
      }

      const isAlreadyArchive = await this.archiveModel.deleteOne({
        author: authorId,
        blogId
      }).exec()

      if(isAlreadyArchive.deletedCount <= 0){
        await this.archiveModel.create({
          author: new Types.ObjectId(authorId),
          blogId: new Types.ObjectId(blogId)
        })

        await this.blogModel.findByIdAndUpdate(blogId, {
          $set:{
            isArchive: true
          }
        })

        return true;
      }else {
        await this.blogModel.findByIdAndUpdate(blogId, {
          $set: {
            isArchive: false
          }
        })
      }
      
      return false;
    } catch (error) {
      if(error instanceof BadRequestException || error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException({
        msg: 'Internal Server Error.',
        code: 'INTERNAL_SERVER_ERROR',
        error
      })
    }
  }

  async viewBlog(blogId: string):Promise<boolean>{
    if(!isValidObjectId(blogId)){
      throw new BadRequestException({
        msg: 'Invalid Author or Blog ID.',
        code: 'INVALID_ID'
      })
    }

    try {
      const isBlog = await this.blogModel.exists({_id: blogId})

      if(!isBlog){
        throw new NotFoundException({
          msg: 'Blog not found.',
          code: 'NOT_FOUND'
        })
      }

      await this.blogModel.findByIdAndUpdate(blogId, {
        $inc: {
          views: 1
        }
      })

      return true;
    } catch (error) {
      if(error instanceof BadRequestException || error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException({
        msg: 'Internal Server Error.',
        code: 'INTERNAL_SERVER_ERROR',
        error
      })
    }
  }
  
  async getLikedBlogs(userId:string):Promise<BlogDocument[]>{
    if(!isValidObjectId(userId)){
      throw new BadRequestException({
        msg: 'Invalid Author ID.',
        code: 'INVALID_ID'
      })
    }

    try {
      let blogs:BlogDocument[] = [];

      const likes = await this.likeModel.find({
        author: userId
      })

      if(likes.length <= 0) throw new NotFoundException({
        msg: "No liked blogs yet.",
        code: 'NOT_FOUND'
      })

      await Promise.all(likes.map(async (like) => {
        const blog = await this.blogModel.findById(like.blogId)
        blogs.push(blog as BlogDocument);
      }))

      return blogs;
    } catch (error) {
      if(error instanceof BadRequestException || error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException({
        msg: 'Internal Server Error.',
        code: 'INTERNAL_SERVER_ERROR',
        error
      })
    }
  }

  async getSavedBlogs(userId:string):Promise<BlogDocument[]>{
    if(!isValidObjectId(userId)){
      throw new BadRequestException({
        msg: 'Invalid Author ID.',
        code: 'INVALID_ID'
      })
    }

    try {
      let blogs:BlogDocument[] = [];

      const saved = await this.saveModel.find({
        author: userId
      })

      if(saved.length <= 0) throw new NotFoundException({
        msg: "No saved blogs yet.",
        code: 'NOT_FOUND'
      })

      await Promise.all(saved.map(async (save) => {
        const blog = await this.blogModel.findById(save.blogId)
        blogs.push(blog as BlogDocument);
      }))

      return blogs;
    } catch (error) {
      if(error instanceof BadRequestException || error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException({
        msg: 'Internal Server Error.',
        code: 'INTERNAL_SERVER_ERROR',
        error
      })
    }
  }

  async getArchiveBlogs(userId:string):Promise<BlogDocument[]>{
    if(!isValidObjectId(userId)){
      throw new BadRequestException({
        msg: 'Invalid Author ID.',
        code: 'INVALID_ID'
      })
    }

    try {
      let blogs:BlogDocument[] = [];

      const archives = await this.archiveModel.find({
        author: userId
      })

      if(archives.length <= 0) throw new NotFoundException({
        msg: "No archive blogs yet.",
        code: 'NOT_FOUND'
      })

      await Promise.all(archives.map(async (archive) => {
        const blog = await this.blogModel.findById(archive.blogId)
        blogs.push(blog as BlogDocument);
      }))

      return blogs;
    } catch (error) {
      if(error instanceof BadRequestException || error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException({
        msg: 'Internal Server Error.',
        code: 'INTERNAL_SERVER_ERROR',
        error
      })
    }
  }

  async getNotifications(userId:string):Promise<TNotification[]>{
    if(!isValidObjectId(userId)){
      throw new BadRequestException({
        msg: 'Invalid Author ID.',
        code: 'INVALID_ID'
      })
    }

    try {
      let notificationsArr: TNotification[] = []

      const notifications = await this.notificationModel.find({
        author: userId
      })

      if(notifications.length <= 0) throw new NotFoundException({
        msg: "No notification yet.",
        code: 'NOT_FOUND'
      })

      await Promise.all(notifications.map(async notification => {
        const blog = await this.blogModel.findById(notification.blogId)
        const activityUser = await this.userModel.findById(notification.likedBy)
        notificationsArr.push({
          likedBy: activityUser?.username ?? '',
          blog
        })
      }))
      

      return notificationsArr;
    } catch (error) {
      if(error instanceof BadRequestException || error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException({
        msg: 'Internal Server Error.',
        code: 'INTERNAL_SERVER_ERROR',
        error
      })
    }
  }
}
