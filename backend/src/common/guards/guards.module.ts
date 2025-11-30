import { forwardRef, Module } from "@nestjs/common";
import { IsLoggedInGuard } from "./isloggedin.guard";
import { UserModule } from "src/modules/user/user.module";
import { CommonModule } from "../common.module";


@Module({
    imports: [
        CommonModule,
        forwardRef(() => UserModule)
    ],
    providers: [IsLoggedInGuard],
    exports: [IsLoggedInGuard]
})

export class GuardModule {}