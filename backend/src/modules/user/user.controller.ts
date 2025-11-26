import { Controller } from "@nestjs/common";

// Services
import { UserService } from "./user.service";


@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService) {}
}