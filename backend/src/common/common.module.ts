import { Module } from "@nestjs/common";
import { IsLoggedInGuard } from "./guards/isloggedin.guard";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

// Schema
import { UserSchema, User } from "../modules/user/schema/user.schema";

@Module({
    imports: [
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>("JWT_SECRET"),
                signOptions: {
                    expiresIn: '30d',
                    algorithm: 'HS256',
                },
            }),
        }),
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema,
            }
        ]),
    ],
    providers: [IsLoggedInGuard],
    exports: [
        IsLoggedInGuard,
        JwtModule,
        MongooseModule,
    ],
}) 
export class CommonModule {}