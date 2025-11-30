import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

// Modules
import { CommonModule } from 'src/common/common.module';
import { MongooseModule } from '@nestjs/mongoose';

// Schema
import { ProfileSchema, Profile } from './schema/profile.schema';
import { UserModule } from '../user/user.module';
import { GuardModule } from 'src/common/guards/guards.module';

@Module({
  imports: [
    CommonModule,
    UserModule,
    GuardModule,
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
