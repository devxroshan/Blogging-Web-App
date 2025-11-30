import { Controller, Get, Post, Patch, Delete, Req, Res, Body, Param, Query, UseGuards } from "@nestjs/common";
import * as express from 'express'


// Services
import { UserService } from "./user.service";

// Schema
import { User, UserDocument } from "./schema/user.schema";

// Utils
import { SuccessResponse } from "src/common/utils/types";
import { UpdateUserDto } from "./dto/update-user.dto";
import { IsLoggedInGuard } from "src/common/guards/isloggedin.guard";


@Controller("api/user/")
@UseGuards(IsLoggedInGuard)
export class UserController {
    constructor(private readonly userService: UserService) {}

    
    @Patch('updateUser')
    async UpdateUser(@Req() req:express.Request, @Body() updateUserDto:UpdateUserDto):Promise<SuccessResponse<User>>{
        const user = await this.userService.updateUser(req.user.id, updateUserDto)
        return {
            ok: true,
            msg: updateUserDto.email?'We have sent you a confirmation email to change your email. Check your inbox or spam':'User updated successfully.',
            data:user
        }
    }
    
    @Get('updateEmail')
    async UpdateEmail(@Query('token') token:string):Promise<SuccessResponse<User>>{
        const user = await this.userService.updateUserEmail(token)
        return {
            ok: true,
            msg: "User's email updated successfully.",
            data: user
        }
    }

    @Get(':username')
    async GetUser(@Param('username') username: string):Promise<SuccessResponse<User>>{
        const user = await this.userService.getUser(username)
        return {
            ok: true,
            msg: "User fetched successfully.",
            data: user
        }
    }
}