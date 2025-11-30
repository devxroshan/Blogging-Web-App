import { forwardRef, Module } from '@nestjs/common';

// Controller
import { UserController } from './user.controller';
// Service
import { UserService } from './user.service';
// Mongoose
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, User } from './schema/user.schema';
import { CommonModule } from 'src/common/common.module';
import { GuardModule } from 'src/common/guards/guards.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CommonModule,
    forwardRef(() => GuardModule)
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, MongooseModule],
})
export class UserModule {}
