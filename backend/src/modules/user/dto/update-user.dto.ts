import { PartialType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsLowercase,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsLowercase()
  @IsNotEmpty()
  @Matches(/^[a-z0-9_]+$/, {
    message:
      'Username can only contain lowercase letters, numbers, and underscores.',
  })
  readonly username?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly email?: string;
}
