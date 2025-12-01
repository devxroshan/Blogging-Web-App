import { Module } from '@nestjs/common';

// Modules
import { MongooseModule } from '@nestjs/mongoose';
import { GuardModule } from 'src/common/guards/guards.module';

// Controller
import { BlogController } from './blog.controller';

// Services
import { BlogService } from './blog.service';

// Schemas
import { BlogSchema, Blog } from './schema/blog.schema';
import { CommonModule } from 'src/common/common.module';
import { UserModule } from '../user/user.module';



@Module({
  imports: [
    CommonModule,
    GuardModule,
    UserModule,
    MongooseModule.forFeature([
      {
        name: Blog.name,
        schema: BlogSchema,
      },
    ]),
  ],
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService, MongooseModule],
})
export class BlogModule {}
