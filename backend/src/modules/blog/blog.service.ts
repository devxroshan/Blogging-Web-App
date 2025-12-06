import {
  Injectable,
  Body,
  Req,
  InternalServerErrorException,
  Get,
  Param,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as express from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { isValidObjectId, Model, MongooseError, Types } from 'mongoose';
import { BlogDocument, Blog, EBlogCategory } from './schema/blog.schema';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UserDocument, User } from '../user/schema/user.schema';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Comment, CommentDocument } from '../comment/schema/comment.schema';
import { Like, LikeDocument } from '../activity/schema/like.schema';
import { Save, SaveDocument } from '../activity/schema/save.schema';
import { ArchiveDocument, Archive } from '../activity/schema/archive.schema';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Like.name) private likeModel: Model<LikeDocument>,
    @InjectModel(Save.name) private saveModel: Model<SaveDocument>,
    @InjectModel(Archive.name) private archiveModel: Model<ArchiveDocument>,
    private configService: ConfigService,
  ) {}

  async createBlog(
    authorId: Types.ObjectId,
    createBlogDto: CreateBlogDto,
  ): Promise<Blog> {
    try {
      const newBlog = await this.blogModel.create({
        author: new Types.ObjectId(authorId),
        title: createBlogDto.title,
        blog: createBlogDto.blog,
        category: createBlogDto.category as EBlogCategory,
      });

      return newBlog;
    } catch (error) {
      throw new InternalServerErrorException({
        msg: 'Internal Server Error.',
        code: 'INTERNAL_SERVER_ERROR',
        error,
      });
    }
  }

  async getBlog(username: string): Promise<BlogDocument[]> {
    if (!username || username == undefined) {
      throw new BadRequestException({
        msg: 'Username required.',
        code: 'BAD_REQUEST',
      });
    }

    try {
      const user: UserDocument | null = await this.userModel.findOne({
        username,
      });
      if (!user) {
        throw new NotFoundException({
          msg: 'User not found.',
          code: 'NOT_FOUND',
        });
      }

      const blogs: BlogDocument[] = await this.blogModel.find({
        author: user._id,
        isArchive: false
      });

      if (blogs.length <= 0) {
        throw new NotFoundException({
          msg: 'No blogs.',
          code: 'NOT_FOUND',
        });
      }

      return blogs;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;

      throw new InternalServerErrorException({
        msg: 'Internal Server Error.',
        code: 'INTERNAL_SERVER_ERROR',
        error,
      });
    }
  }

  async updateBlog(
    authorId: string,
    blogId: string,
    updateBlogDto: UpdateBlogDto,
  ): Promise<BlogDocument> {
    if (!isValidObjectId(blogId) || !isValidObjectId(authorId)) {
      throw new BadRequestException({
        msg: 'Invalid Blog or Author ID.',
        code: 'INVALID_ID',
      });
    }

    if (Object.values(updateBlogDto).every((value) => value == undefined)) {
      throw new BadRequestException({
        msg: 'No fields are given to update.',
        code: 'BAD_REQUEST',
      });
    }

    try {
      const updatedBlog = await this.blogModel.findOneAndUpdate(
        { author: new Types.ObjectId(authorId), _id: blogId },
        {
          $set: {
            ...updateBlogDto,
          },
        },
        { new: true },
      );

      if (!updatedBlog) {
        throw new NotFoundException({
          msg: 'Blog not found.',
          code: 'NOT_FOUND',
        });
      }

      return updatedBlog;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;

      throw new InternalServerErrorException({
        msg: 'Internal Server Error.',
        code: 'INTERNAL_SERVER_ERROR',
        error,
      });
    }
  }

  async DeleteBlog(authorId: string, blogId: string): Promise<void> {
    if (!isValidObjectId(blogId) || !isValidObjectId(authorId)) {
      throw new BadRequestException({
        msg: 'Invalid Blog or Author ID.',
        code: 'INVALID_ID',
      });
    }

    try {
      const isDeleted = await this.blogModel
        .findOneAndDelete({
          author: new Types.ObjectId(authorId),
          _id: blogId,
        })
        .exec();

      await this.commentModel.deleteMany({
        blogId: new Types.ObjectId(blogId),
      }).exec();

      await this.likeModel.deleteMany({
        blogId: new Types.ObjectId(blogId)
      })
      await this.saveModel.deleteMany({
        blogId: new Types.ObjectId(blogId)
      })
      await this.archiveModel.deleteMany({
        blogId: new Types.ObjectId(blogId)
      })

      if (!isDeleted) {
        throw new NotFoundException({
          msg: 'Blog not found.',
          code: 'NOT_FOUND',
        });
      }
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      )
        throw error;

      if (error.name == 'MongoNetworkError') {
        throw new InternalServerErrorException({
          msg: 'Database Unavailable. Try again later.',
          code: 'INTERNAL_SERVER_ERROR',
          error,
        });
      }

      throw new InternalServerErrorException({
        msg: 'Internal Server Error.',
        code: 'INTERNAL_SERVER_ERROR',
        error,
      });
    }
  }
}
