import { Body, Controller, Req, UseGuards, Post, Get, Param, Patch, Delete } from '@nestjs/common';
import * as express from 'express'

// Guards
import { IsLoggedInGuard } from 'src/common/guards/isloggedin.guard';

// Services
import { BlogService } from './blog.service';

// Utils
import { SuccessResponse } from 'src/common/utils/types';

// Dtos
import { CreateBlogDto } from './dto/create-blog.dto';

// Schemas
import { Blog, BlogDocument } from './schema/blog.schema';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Controller('api/blog/')
@UseGuards(IsLoggedInGuard)
export class BlogController {
  constructor(private blogService: BlogService) {}


  @Post()
  async CreateBlog(@Req() req:express.Request, @Body() createBlogDto: CreateBlogDto):Promise<SuccessResponse<Blog>>{
    const newBlog = await this.blogService.createBlog(req.user.id, createBlogDto)
    return {
        ok: true,
        msg: 'Blog created successfully.',
        data: newBlog
    }
  }

  @Get(':username')
  async GetBlogs(@Param('username') username:string):Promise<SuccessResponse<BlogDocument[]>>{
    const blogs = await this.blogService.getBlog(username)
    return {
      ok: true,
      msg: 'Blogs fetched successfully.',
      data: blogs
    }
  }

  @Patch(':blogId')
  async UpdateBlog(@Req() req:express.Request, @Param('blogId') blogId:string,@Body() updateBlogDto:UpdateBlogDto):Promise<SuccessResponse<BlogDocument>>{
    const blog = await this.blogService.updateBlog(req.user.id, blogId, updateBlogDto)
    return {
      ok: true,
      msg: `Blog ${blogId} updated successfully.`,
      data: blog
    }
  }

  @Delete(':blogId')
  async DeleteBlog(@Req() req:express.Request, @Param('blogId') blogId:string):Promise<SuccessResponse<{}>>{
    await this.blogService.DeleteBlog(req.user.id, blogId)
    return {
      ok: true,
      msg: `Blog ${blogId} deleted successfully.`,
      data: {}
    }
  }
}
