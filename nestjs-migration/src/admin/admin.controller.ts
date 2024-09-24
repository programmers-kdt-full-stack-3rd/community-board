import {
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Query,
	UseGuards,
} from "@nestjs/common";
import { AdminOnly } from "../common/decorator/rbac.decorator";
import { LoginGuard } from "../common/guard/login.guard";
import { AdminService } from "./admin.service";
import { GetUsersDto } from "./dto/get-users.dto";

@UseGuards(LoginGuard)
@Controller("admin")
@AdminOnly()
export class AdminController {
	constructor(private readonly adminService: AdminService) {}

	@Get("/user")
	@HttpCode(HttpStatus.OK)
	async getUsers(@Query() getUsersDto: GetUsersDto) {
		const result = await this.adminService.getUsers(getUsersDto);

		return result;
	}
}
