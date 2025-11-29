import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

// Models
import { Profile, ProfileDocument } from './schema/profile.schema';
import { CreateProfileDto } from './dto/create-profile.dto';
import { DB_ERRORS } from 'src/database/errors';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User, UserDocument } from '../user/schema/user.schema';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  async createProfile(
    userId: mongoose.Types.ObjectId,
    createProfileDto: CreateProfileDto,
  ): Promise<Profile> {
    try {
      const newProfile = await this.profileModel.create({
        userId,
        ...createProfileDto,
      });

      return newProfile;
    } catch (error) {
      if (error.code == DB_ERRORS.DUPLICATE_KEY) {
        throw new ConflictException({
          msg: 'Profile already exits.',
          code: 'DUPLICATE_KEY',
        });
      }
      throw new InternalServerErrorException({
        msg: 'Internal Server Error.',
        code: 'INTERNAL_SERVER_ERROR',
        error,
      });
    }
  }

  async updateProfile(
    userId: mongoose.Types.ObjectId,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    if (!mongoose.isValidObjectId(userId)) {
      throw new UnauthorizedException({
        msg: 'Invalid ID format.',
        code: 'INVALID_ID_FORMAT',
      });
    }

    if(Object.keys(updateProfileDto).length <= 0){
      throw new BadRequestException({
        msg: "Nothing to update.",
        code: "BAD_REQUEST"
      })
    }

    try {
      const updatedUser = await this.profileModel.findOneAndUpdate(
        {userId},
        {
          $set: {
            ...updateProfileDto,
          },
        },
        { new: true },
      );

      if (!updatedUser) {
        throw new NotFoundException({
          msg: 'Profile not found.',
          code: 'NOT_FOUND',
        });
      }

      return updatedUser;
    } catch (error) {
      // Re-throw if it's already a handled NestJS exception
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      throw new InternalServerErrorException({
        msg: 'Internal Server Error.',
        code: "INTERNAL_SERVER_ERROR",
        error
      });
    }
  }

  async getProfile(username: string):Promise<Profile> {
    try {
      const user = await this.userModel.findOne({username})

      if(!user){
        throw new NotFoundException({
          msg: "User not found.",
          code: "NOT_FOUND"
        })
      }

      const profile:Profile | null = await this.profileModel.findOne({userId: user.id})

      if(!profile){
        throw new NotFoundException({
          msg: "Profile not found.",
          code: "NOT_FOUND"
        })
      }

      return profile
    } catch (error) {
      if(error instanceof NotFoundException){
        throw error
      }

      throw new InternalServerErrorException({
        msg: "Internal Server Errror.",
        code: 'INTERNAL_SERVER_ERROR',
        error
      })
    }
  }

  async deleteProfile(userId: string):Promise<boolean> {
    try {
      const profileDeleted = await this.profileModel.deleteOne({
        userId
      }).exec()

      if(profileDeleted.deletedCount == 0){
        throw new NotFoundException({
          msg: 'Profile not found.',
          code: 'NOT_FOUND'
        })
      }

      return true
    } catch (error) {
      if(error instanceof NotFoundException){
        throw error
      }

      throw new InternalServerErrorException({
        msg: "Internal Server Error.",
        code: 'INTERNAL_SERVER_ERROR',
        error
      })
    }
  }
}
