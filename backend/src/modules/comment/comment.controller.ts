import { Controller, UseGuards, Post, Get, Patch, Delete, Req, Body, Param, Query } from "@nestjs/common";
import * as express from 'express';
import { IsLoggedInGuard } from "src/common/guards/isloggedin.guard";
import { CommentService } from "./comment.service";
import { SuccessResponse } from "src/common/utils/types";
import { CommentDocument } from "./schema/comment.schema";
import { CreateCommentDto } from "./dto/create-comment.dto";

@Controller('api/comment/')
@UseGuards(IsLoggedInGuard)
export class CommentController {
    constructor(private readonly commentService:CommentService){}

    @Post(':blogId')
    async CreateComment(@Req() req:express.Request,@Param('blogId') blogId:string, @Body() createCommentDto:CreateCommentDto):Promise<SuccessResponse<CommentDocument>>{
        const newComment = await this.commentService.createComment(req.user.id, blogId, createCommentDto)
        return {
            ok: true,
            msg: 'Comment posted successfully.',
            data: newComment
        }
    }


    @Get(':blogId')
    async GetComment(@Param('blogId') blogId:string):Promise<SuccessResponse<CommentDocument[]>>{
        const comments = await this.commentService.getComments(blogId)
        return {
            ok: true,
            msg: 'Comment posted successfully.',
            data: comments
        }
    }

    @Delete(':commentId')
    async DeleteComment(@Req() req:express.Request, @Param('commentId') commentId:string):Promise<SuccessResponse<{}>>{
        await this.commentService.deleteComment(req.user.id, commentId)
        return {
            ok: true,
            msg: `Comment ${commentId} posted successfully.`,
            data: {}
        }
    }
}