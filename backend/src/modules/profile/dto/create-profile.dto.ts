import { Optional } from '@nestjs/common';
import {
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import mongoose from 'mongoose';

export class CreateProfileDto {
  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsString()
  fullname?: string;
}
