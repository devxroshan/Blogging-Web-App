import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, ObjectId, isValidObjectId } from 'mongoose';

// Schemas
import { User, UserDocument } from './schema/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private mailerService: MailerService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async getUser(username: string): Promise<User> {
    if (typeof username != 'string' || !username) {
      throw new BadRequestException({
        msg: 'Invalid USERNAME formate.',
        code: 'INVALID_USERNAME_FORMAT',
      });
    }

    try {
      const user: User | null = await this.userModel
        .findOne({ username })
        .select('-password');

      if (!user) {
        throw new NotFoundException({
          msg: 'User not found.',
          code: 'NOT_FOUND',
        });
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException({
        msg: 'Internal Server Error.',
        code: 'INTERNAL_SERVER_ERROR',
        error,
      });
    }
  }

  async updateUser(
    userId: ObjectId,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    if ((Object.keys(updateUserDto).length = 0)) {
      throw new BadRequestException({
        msg: 'No fields to update.',
        code: 'BAD_REQUEST',
      });
    }

    try {
      const user = await this.userModel.findById(userId);

      if (!user)
        throw new NotFoundException({
          msg: 'User not found.',
          code: 'NOT_FOUND',
        });

      if (updateUserDto.username) {
        if (await this.userModel.exists({ username: updateUserDto.username })) {
          throw new ConflictException({
            msg: 'Username already exits',
            code: 'BAD_REQUEST',
          });
        }
        user.username = updateUserDto.username;
        await user.save();
      }

      if (updateUserDto.email) {
        const emailChangeSecret = await this.jwtService.signAsync({
          userId: user.id,
          email: updateUserDto.email,
        }, {
          expiresIn: '2m'
        });

        const info = await this.mailerService.sendMail({
          to: updateUserDto.email,
          subject: 'Change your email.',
          template: 'change-email', // Assumes you have a 'welcome' template set up
          context: {
            username: user.username,
            newEmail: updateUserDto.email,
            changeUrl: `${this.configService.get('BACKEND_URL')}/user/updateEmail?token=${emailChangeSecret}`,
            expiresIn: '2m',
            supportEmail: this.configService.get('SUPPORT_EMAIL'),
            appName: this.configService.get('APP_NAME'),
            currentYear: new Date().getFullYear(),
          },
        });

        if (info.rejected.length > 0) {
          throw new BadRequestException({
            msg: 'Failed to send mail. try again later.',
            code: 'BAD_REQUEST',
          });
        }
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof ConflictException) throw error;
      if (error instanceof BadRequestException) throw error;

      throw new InternalServerErrorException({
        msg: 'Internal Server Error.',
        code: 'INTERNAL_SERVER_ERROR',
        error,
      });
    }
  }

  async updateUserEmail(token: string): Promise<User> {
    if (!token) {
      throw new BadRequestException({
        msg: 'Token required.',
        code: 'BAD_REQUEST',
      });
    }

    try {
      const decodedToken = (await this.jwtService.verify(token)) as {
        userId: string;
        email: string;
      };

      const user = await this.userModel.findById(decodedToken.userId).select('-password');
      if (!user)
        throw new NotFoundException({
          msg: 'User not found.',
          code: 'NOT_FOUND',
        });

      
      if(user.email == decodedToken.email){
        throw new BadRequestException({
          msg: "You can't change your email to your current email again.",
          code: 'BAD_REQUEST'
        })
      }

      user.email = decodedToken.email;
      await user.save();

      return user;
    } catch (error) {
      if (error instanceof TokenExpiredError)
        throw new UnauthorizedException({
          msg: 'Token Expired.',
          code: 'TOKEN_EXPIRED',
        });
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
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
