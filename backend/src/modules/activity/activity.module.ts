import { forwardRef, Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { CommonModule } from 'src/common/common.module';
import { GuardModule } from 'src/common/guards/guards.module';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Like, LikeSchema } from './schema/like.schema';
import { BlogModule } from '../blog/blog.module';
import { Save, SaveSchema } from './schema/save.schema';
import { Archive, ArchiveSchema } from './schema/archive.schema';
import { Notification, NotificationSchema } from './schema/notification.schema';

@Module({
  imports: [
    CommonModule,
    GuardModule,
    UserModule,
    forwardRef(() => BlogModule),
    MongooseModule.forFeature([
      {
        name: Like.name,
        schema: LikeSchema
      },
      {
        name: Save.name,
        schema: SaveSchema
      },
      {
        name: Archive.name,
        schema: ArchiveSchema
      },
      {
        name: Notification.name,
        schema: NotificationSchema
      }
    ])
  ],
  controllers: [ActivityController],
  providers: [ActivityService],
  exports: [MongooseModule]
})
export class ActivityModule {}
