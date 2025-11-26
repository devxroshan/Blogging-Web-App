import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginAuthDto {
    @IsNotEmpty()
    @IsString()
    usernameOrEmail: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}