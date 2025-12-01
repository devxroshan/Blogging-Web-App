import {IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateBlogDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    title?:string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    blog?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    blogImg?: string;
}