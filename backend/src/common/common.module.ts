import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

// Schemas
import { UserSchema, User } from 'src/modules/user/schema/user.schema';
import { IsLoggedInGuard } from './guards/isloggedin.guard';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: {
                expiresIn: 30 * 24 * 60 * 60, // 30 days
                algorithm: 'HS256',
            },
        }),
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({}),
  ],
  providers: [IsLoggedInGuard],
  exports: [IsLoggedInGuard],
})
export class CommonModule {}
