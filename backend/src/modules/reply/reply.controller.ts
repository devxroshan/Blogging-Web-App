import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import * as express from 'express';
import { ReplyService } from './reply.service';
import { CreateReplyDto } from './dto/create-reply.dto';
import { SuccessResponse } from 'src/common/utils/types';
import { ReplyDocument } from './schema/reply.schema';
import { IsLoggedInGuard } from 'src/common/guards/isloggedin.guard';

@Controller('api/reply/')
@UseGuards(IsLoggedInGuard)
export class ReplyController {
  constructor(private readonly replyService: ReplyService) {}

  @Post(':commentId')
  async PostReply(@Req() req:express.Request, @Param('commentId') commentId:string, @Body() createReplyDto:CreateReplyDto):Promise<SuccessResponse<ReplyDocument>>{
    const newReply = await this.replyService.postReply(req.user.id, commentId, createReplyDto)
    return {
      ok: true,
      msg: `Replied to comment ${commentId} successfully.`,
      data: newReply
    }
  }

  @Get(':commentId')
  async GetReply(@Param('commentId') commentId:string):Promise<SuccessResponse<ReplyDocument[]>>{
    const replies = await this.replyService.getReplies(commentId)
    return {
      ok: true,
      msg: `Your replies to comment ${commentId} fetched successfully.`,
      data: replies
    }
  }

  @Delete(':replyId')
  async DeleteReply(@Req() req:express.Request, @Param('replyId') replyId:string):Promise<SuccessResponse<{}>>{
    await this.replyService.deleteReplies(req.user.id, replyId)
    return {
      ok: true,
      msg: `Reply deleted successfully.`,
      data: {}
    }
  }
}
