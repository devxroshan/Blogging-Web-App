import { Module } from '@nestjs/common';
import { ReplyService } from './reply.service';
import { ReplyController } from './reply.controller';
import { CommentModule } from '../comment/comment.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Reply, ReplySchema } from './schema/reply.schema';
import { CommonModule } from 'src/common/common.module';
import { GuardModule } from 'src/common/guards/guards.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    CommonModule,
    GuardModule,
    UserModule,
    CommentModule,
    MongooseModule.forFeature([{
      name: Reply.name,
      schema: ReplySchema
    }])
  ],
  controllers: [ReplyController],
  providers: [ReplyService],
  exports: [ReplyService]
})
export class ReplyModule {}
