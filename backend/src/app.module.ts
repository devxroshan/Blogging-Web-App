import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { JwtModule } from '@nestjs/jwt';

import { AppController } from './app.controller';
import { AppService } from './app.service';


import { ConfigModule, ConfigService } from '@nestjs/config';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

// Mongoose
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URL'),
      }),
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          service: 'gmail',
          auth: {
            user: configService.get<string>('MAILER_USER'),
            pass: configService.get<string>('MAILER_PASS'),
          }
        },
        template: {
          dir: join(__dirname,'../','src', 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    AuthModule,
    UserModule,
    ProfileModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
