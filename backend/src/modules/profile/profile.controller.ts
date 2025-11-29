import { Controller, UseGuards, Req, Res, Body, Post, Patch, Get, Param, Delete } from "@nestjs/common";
import { IsLoggedInGuard } from "src/common/guards/isloggedin.guard";
import { ProfileService } from "./profile.service";

import * as express from 'express'
import { CreateProfileDto } from "./dto/create-profile.dto";
import { SuccessResponse } from "src/common/utils/types";
import { Profile } from "./schema/profile.schema";
import { UpdateProfileDto } from "./dto/update-profile.dto";


@Controller('/api/profile')
@UseGuards(IsLoggedInGuard)
export class ProfileController {
    constructor(private readonly profileService:ProfileService) {}

    @Post()
    async CreateProfile(@Req() req:express.Request, @Body() createProfileDto:CreateProfileDto):Promise<SuccessResponse<Profile>>{
        const newProfile = await this.profileService.createProfile(req.user.id, createProfileDto)
        return {
            ok: true,
            msg:"User's profile created successfully.",
            data: newProfile
        }
    }

    @Patch('/update')
    async UpdateProfile(@Req() req:express.Request, @Body() updateProfileDto:UpdateProfileDto):Promise<SuccessResponse<Profile>>{
        const updatedUser = await this.profileService.updateProfile(req.user.id, updateProfileDto)
        return {
            ok: true,
            msg: "Updated successfuly.",
            data: updatedUser
        }
    }

    @Get('/:username')
    async GetProfile(@Param('username') username:string):Promise<SuccessResponse<Profile>> {
        const profile:Profile = await this.profileService.getProfile(username)
        return {
            ok: true,
            msg: "Profile fetched successfully.",
            data: profile
        } 
    }
    
    @Delete('/')
    async DeleteProfile(@Req() req:express.Request):Promise<SuccessResponse<{}>>{
        await this.profileService.deleteProfile(req.user.id)
        return {
            ok: true,
            msg: 'Profile deleted successfully.',
            data: {}
        }
    }
}