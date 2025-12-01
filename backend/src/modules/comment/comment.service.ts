import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './schema/comment.schema';
import { isValidObjectId, Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Blog, BlogDocument } from '../blog/schema/blog.schema';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
    private readonly configService: ConfigService,
  ) {}

  async createComment(
    authorId: string,
    blogId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<CommentDocument> {
    if (!isValidObjectId(authorId) || !isValidObjectId(blogId)) {
      throw new BadRequestException({
        msg: 'Invalid Authro ID or Blog ID.',
        code: 'INVALID_ID',
      });
    }

    try {
      const isBlog = await this.blogModel.findById(new Types.ObjectId(blogId));
      if (!isBlog) {
        throw new NotFoundException({
          msg: 'Blog not found.',
          code: 'NOT_FOUND',
        });
      }

      const newComment = await this.commentModel.create({
        author: new Types.ObjectId(authorId),
        blogId: new Types.ObjectId(blogId),
        content: createCommentDto.content,
      });

      return newComment;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      )
        throw error;

      throw new InternalServerErrorException({
        msg: 'Internal Server Error.',
        code: 'INTERNAL_SERVER_ERROR',
        error,
      });
    }
  }

  async getComments(blogId: string): Promise<CommentDocument[]> {
    if (!isValidObjectId(blogId)) {
      throw new BadRequestException({
        msg: 'Invalid Blog ID.',
        code: 'INVALID_ID',
      });
    }

    try {
      const isBlog = await this.blogModel.findById(new Types.ObjectId(blogId));
      if (!isBlog) {
        throw new NotFoundException({
          msg: 'Blog not found.',
          code: 'NOT_FOUND',
        });
      }

      const comments = await this.commentModel.find({
        blogId: new Types.ObjectId(blogId),
      });

      if (comments.length <= 0) {
        throw new NotFoundException({
          msg: 'No comments found.',
          code: 'NOT_FOUND',
        });
      }

      return comments;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      )
        throw error;

      throw new InternalServerErrorException({
        msg: 'Internal Serve Error.',
        code: 'INTERNAL_SERVER_ERROR',
        error,
      });
    }
  }

  async deleteComment(authorId: string, commentId: string): Promise<void> {
    if (!isValidObjectId(commentId) || !isValidObjectId(authorId))
      throw new BadRequestException({
        msg: 'Invalid Blog ID.',
        code: 'INVALID_ID',
      });

    try {
      const isDeleted = await this.commentModel
        .deleteOne({
          author: new Types.ObjectId(authorId),
          _id: new Types.ObjectId(commentId),
        })
        .exec();

      if (isDeleted.deletedCount <= 0) {
        throw new NotFoundException({
          msg: 'Comment not found.',
          code: 'NOT_FOUND',
        });
      }
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      )
        throw error;

      throw new InternalServerErrorException({
        msg: 'Internal Server Error.',
        code: 'INTERNAL_SERVER_ERROR',
        error,
      });
    }
  }
}
