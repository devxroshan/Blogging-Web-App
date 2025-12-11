import { Body, Controller, Query, Req } from "@nestjs/common";
import { Post, Get, Res } from "@nestjs/common";
import * as express from "express";

// Services
import { AuthService } from "./auth.service";

// DTOs
import { CreateAuthDto } from "./dto/create-auth.dto";
import { Environment, SuccessResponse } from "src/common/utils/types";
import { UserDocument } from "../user/schema/user.schema";
import { LoginAuthDto } from "./dto/login-auth.dto";
import { ConfigService } from "@nestjs/config";

@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private configService:ConfigService) {}

    @Post('signup')
    async signup(@Body() createAuthDto:CreateAuthDto):Promise<SuccessResponse<UserDocument>> {
        return await this.authService.createUser(createAuthDto);
    }

    @Get('confirm-email')
    async confirmEmail(@Query('token') token: string):Promise<SuccessResponse<{}>> {
        return await this.authService.confirmEmail(token);
    }

    @Get('login')
    async login(@Res({passthrough: true}) res:express.Response, @Query() loginAuthDto:LoginAuthDto) {
        const response = await this.authService.login(loginAuthDto);
        res.cookie(
            'accessToken',
            response.data?.token,
            {
                httpOnly: true,
                secure: true,
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
                sameSite: 'none',
            }
        ).json({
            ok:true,
            msg: 'Login successful',
            data: this.configService.get<string>('NODE_ENV') === Environment.DEV ? response.data?.token : {},
        });
    }

    @Get('is-logged-in')
    async IsLoggedIn(@Req() req:express.Request):Promise<SuccessResponse<boolean>>{
        const isLogin = await this.authService.isLoggedIn(req.cookies.accessToken)
        return {
            ok: true,
            msg: isLogin?'Logged In':'Not Logged In',
            data: isLogin
        } 
    }
}