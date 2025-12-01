import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateReplyDto } from './dto/create-reply.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Reply, ReplyDocument } from './schema/reply.schema';
import { isValidObjectId, Model, Types } from 'mongoose';
import { Comment, CommentDocument } from '../comment/schema/comment.schema';

@Injectable()
export class ReplyService {
  constructor(
    @InjectModel(Reply.name) private readonly replyModel: Model<ReplyDocument>,
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
  ) {}

  async postReply(
    authorId: string,
    commentId: string,
    createReplyDto: CreateReplyDto,
  ): Promise<ReplyDocument> {
    if (!isValidObjectId(commentId) || !isValidObjectId(authorId)) {
      throw new BadRequestException({
        msg: 'Invalid Comment or Author ID.',
        code: 'INVALID ID',
      });
    }

    try {
      const isComment = await this.commentModel.findById(
        new Types.ObjectId(commentId),
      ) || await this.replyModel.findById(commentId);

      if (!isComment) {
        throw new NotFoundException({
          msg: 'Comment not found.',
          code: 'NOT_FOUND',
        });
      }

      const newReply = await this.replyModel.create({
        content: createReplyDto.content,
        author: new Types.ObjectId(authorId),
        repliedTo: new Types.ObjectId(commentId),
      });

      return newReply;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      )
        throw error;

      throw new InternalServerErrorException({
        msg: 'Internal Server Error.',
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  }

  async getReplies(commentId: string): Promise<ReplyDocument[]> {
    if (!isValidObjectId(commentId)) {
      throw new BadRequestException({
        msg: 'Invalid Comment ID.',
        code: 'INTERNAL_SERVER_ERROR.',
      });
    }

    try {
      const isComment = await this.commentModel.findById(commentId)

      if(!isComment){
        throw new NotFoundException({
          msg: 'Comment not found.',
          code: 'NOT_FOUND'
        })
      }

      const replies = await this.replyModel.find({
        repliedTo: new Types.ObjectId(commentId),
      });

      if (replies.length <= 0) {
        throw new NotFoundException({
          msg: 'No replies found.',
          code: 'NOT_FOUND',
        });
      }

      return replies;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      )
        throw error;

      throw new InternalServerErrorException({
        msg: 'Internal Server Error.',
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  }

  async deleteReplies(authorId:string, replyId: string):Promise<void>{
    if(!isValidObjectId(replyId) || !isValidObjectId(authorId)){
      throw new BadRequestException({
        msg: "Invalid Reply ID.",
        code: "INVALID_ID"
      })
    }
    
    try {
      const isDeleted = await this.replyModel.deleteMany({
        $or: [
          {
            author: authorId,
            _id: replyId
          }, {
            repliedTo: replyId
          }
        ]
      })

      if(isDeleted.deletedCount <= 0){
        throw new NotFoundException({
          msg: "Reply not found.",
          code: 'NOT_FOUND'
        })
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
      });
    }
  }
}
