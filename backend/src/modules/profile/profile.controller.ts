import { Controller, UseGuards } from "@nestjs/common";
import { IsLoggedInGuard } from "src/common/guards/isloggedin.guard";


@Controller('/api/profile')
@UseGuards(IsLoggedInGuard)
export class ProfileController {
    constructor() {}
}