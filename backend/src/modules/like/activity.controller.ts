import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import * as express from 'express';
import { ActivityService } from './activity.service';
import { IsLoggedInGuard } from 'src/common/guards/isloggedin.guard';
import { SuccessResponse } from 'src/common/utils/types';
import { LikeDocument } from './schema/like.schema';

@Controller('api/activity/')
@UseGuards(IsLoggedInGuard)
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post('like-unlike/:blogId')
  async CreateLike(@Req() req:express.Request, @Param('blogId') blogId:string):Promise<SuccessResponse<{}>>{
    const isLiked = await this.activityService.createLike(req.user.id, blogId)
    return {
      ok: true,
      msg: isLiked?'Blog lilked successfully.':'Blog unliked successfully.',
      data: {}
    }
  }

  @Post('save-unsave/:blogId')
  async SaveBlog(@Req() req:express.Request, @Param('blogId') blogId:string):Promise<SuccessResponse<{}>>{
    const isSaved = await this.activityService.saveBlog(req.user.id, blogId)
    return {
      ok: true,
      msg: isSaved?'Blog saved successfully.':'Blog unsaved successfully.',
      data: {}
    }
  }

  @Post('archive-unarchive/:blogId')
  async ArchiveUnarchive(@Req() req:express.Request, @Param('blogId') blogId:string):Promise<SuccessResponse<{}>>{
    const isArchive = await this.activityService.archiveBlog(req.user.id, blogId)
    return {
      ok: true,
      msg: isArchive?'Blog archive successfully.':'Blog unarchive successfully.',
      data: {}
    }
  }
}
