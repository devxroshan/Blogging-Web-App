import { IsEmail, IsLowercase, IsNotEmpty, IsString, IsStrongPassword, Matches } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsLowercase()
    @IsNotEmpty()
    @Matches(/^[a-z0-9_]+$/, { message: 'Username can only contain lowercase letters, numbers, and underscores.' })
    readonly username: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;


    @IsString()
    @IsNotEmpty()
    @IsStrongPassword()
    readonly password: string;
}