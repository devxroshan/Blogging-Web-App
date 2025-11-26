import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as argon from 'argon2';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

// Schemas
import { User, UserDocument } from '../user/schema/user.schema';

// DTOs
import { CreateAuthDto } from './dto/create-auth.dto';
import { DB_ERRORS } from 'src/database/errors';

// Utils
import { Environment, SuccessResponse } from 'src/common/utils/types';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private mailerService: MailerService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async createUser(
    createAuthDto: CreateAuthDto,
  ): Promise<SuccessResponse<UserDocument>> {
    try {
      const hashedPassword = await argon.hash(createAuthDto.password);
      const newUser = await this.userModel.create({
        username: createAuthDto.username,
        email: createAuthDto.email,
        password: hashedPassword,
      });

      const emailConfirmationToken = await this.jwtService.signAsync({
        userId: newUser._id,
      });
      const confirmationUrl = `${this.configService.get('BACKEND_URL')}/auth/confirm-email?token=${emailConfirmationToken}`;

      // Send welcome email
      await this.mailerService.sendMail({
        to: newUser.email,
        subject: 'Welcome to Our Service!',
        template: 'email-verification', // Assumes you have a 'welcome' template set up
        context: {
          name: newUser.username,
          confirmationUrl: confirmationUrl,
          // Include a helper for the current year
          currentYear: new Date().getFullYear(),
        },
      });

      const { password, ...userWithoutPassword } = newUser.toObject();

      return {
        ok: true,
        msg: 'User created successfully. We have sent you a confirmation email, Check your inbox or Spam folder.',
        data: userWithoutPassword as UserDocument,
      };
    } catch (error) {
      if (error.code === DB_ERRORS.DUPLICATE_KEY) {
        throw new BadRequestException({
          msg: 'Username or email already exists',
          code: 'DUPLICATE_KEY',
        });
      }

      throw new InternalServerErrorException({
        msg: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR',
        error,
      });
    }
  }

  async confirmEmail(token: string): Promise<SuccessResponse<{}>> {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      const userId = payload.userId;
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new BadRequestException({
          msg: 'Invalid token or user does not exist',
          code: 'INVALID_TOKEN',
        });
      }

      if (user.isVerified) {
        return {
          ok: true,
          msg: 'Email is already confirmed',
          data: {},
        };
      }

      user.isVerified = true;
      await user.save();

      return {
        ok: true,
        msg: 'Email confirmed successfully',
        data: {},
      };
    } catch (error) {
      throw new BadRequestException({
        msg: 'Invalid or expired token',
        code: 'INVALID_TOKEN',
      });
    }
  }

  async login(
    loginAuthDto: LoginAuthDto,
  ): Promise<SuccessResponse<{ token: string }>> {
    try {
      const user = await this.userModel.findOne({
        $or: [
          { username: loginAuthDto.usernameOrEmail },
          { email: loginAuthDto.usernameOrEmail },
        ],
      });

      if (!user) {
        throw new BadRequestException({
          msg: 'Invalid username/email or password',
          code: 'INVALID_CREDENTIALS',
        });
      }

      if (!user.isVerified) {
        await this.mailerService.sendMail({
          to: user.email,
          subject: 'Email Verification Required',
          template: 'email-verification',
          context: {
            name: user.username,
            confirmationUrl: `${this.configService.get('BACKEND_URL')}/auth/confirm-email?token=${await this.jwtService.signAsync({ userId: user._id })}`,
            currentYear: new Date().getFullYear(),
          },
        });

        throw new BadRequestException({
          msg: 'Email not verified. Please verify your email before logging in. We have sent the verification email.',
          code: 'EMAIL_NOT_VERIFIED',
        });
      }

      const isPasswordValid = await argon.verify(
        user.password,
        loginAuthDto.password
      );

      if (!isPasswordValid) {
        throw new BadRequestException({
          msg: 'Invalid username/email or password',
          code: 'INVALID_CREDENTIALS',
        });
      }

      const token = await this.jwtService.signAsync({ userId: user._id });

      return {
        ok: true,
        msg: 'Login successful',
        data: { token },
      };
    } catch (error) {
      throw error;
    }
  }
}
