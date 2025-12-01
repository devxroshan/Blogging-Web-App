import { forwardRef, Module } from "@nestjs/common";
import { GuardModule } from "src/common/guards/guards.module";
import { UserModule } from "../user/user.module";
import { CommonModule } from "src/common/common.module";
import { MongooseModule } from "@nestjs/mongoose";
import { Comment, CommentSchema } from "./schema/comment.schema";
import { CommentController } from "./comment.controller";
import { CommentService } from "./comment.service";
import { BlogModule } from "../blog/blog.module";


@Module({
    imports: [
        CommonModule,
        GuardModule,
        UserModule,
        forwardRef(() => BlogModule),
        MongooseModule.forFeature([{
            name: Comment.name,
            schema: CommentSchema
        }])
    ],
    controllers: [CommentController],
    providers: [CommentService],
    exports: [CommentService, MongooseModule]
})

export class CommentModule{}