import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeDocument } from './schema/like.schema';
import { isValidObjectId, Model, Types } from 'mongoose';
import { Blog, BlogDocument } from '../blog/schema/blog.schema';
import { Save, SaveDocument } from './schema/save.schema';
import { Archive, ArchiveDocument } from './schema/archive.schema';

@Injectable()
export class ActivityService {
  constructor(
    @InjectModel(Like.name) private readonly likeModel: Model<LikeDocument>,
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
    @InjectModel(Save.name) private readonly saveModel: Model<SaveDocument>,
    @InjectModel(Archive.name) private readonly archiveModel: Model<ArchiveDocument>,
  ) {}

  async createLike(authorId: string, blogId: string):Promise<boolean>{
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

      const isAlreadyLiked = await this.likeModel.deleteOne({
        author: authorId,
        blogId
      }).exec()

      if(isAlreadyLiked.deletedCount <= 0){
        await this.likeModel.create({
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
}
