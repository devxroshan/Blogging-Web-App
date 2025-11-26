import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Controllers
import { AuthController } from './auth.controller';

// Services
import { AuthService } from './auth.service';

// Modules
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '30d',
          algorithm: 'HS512',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [],
})
export class AuthModule {}
