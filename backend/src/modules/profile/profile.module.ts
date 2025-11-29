import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

// Modules
import { CommonModule } from 'src/common/common.module';
import { MongooseModule } from '@nestjs/mongoose';

// Schema
import { ProfileSchema, Profile } from './schema/profile.schema';

@Module({
  imports: [
    CommonModule,
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
