import { Module } from "@nestjs/common";

// Controller
import { UserController } from "./user.controller";
// Service
import { UserService } from "./user.service";
// Mongoose
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema, User } from "./schema/user.schema";

@Module({
  imports: [MongooseModule.forFeature([
    { name: User.name, schema: UserSchema },
  ])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, MongooseModule],
})
export class UserModule {}