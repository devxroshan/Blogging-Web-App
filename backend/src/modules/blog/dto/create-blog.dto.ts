import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { EBlogCategory } from "../schema/blog.schema";

export class CreateBlogDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    blog: string;

    @IsNotEmpty()
    @IsString()
    @IsEnum(EBlogCategory, {message: 'Invalid category.'})
    category: EBlogCategory;

    @IsOptional()
    blogImg: string;
}