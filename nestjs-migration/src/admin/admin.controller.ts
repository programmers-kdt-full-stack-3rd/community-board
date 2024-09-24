import {
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseIntPipe,
	Patch,
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

	@Delete("/user/:userId")
	@HttpCode(HttpStatus.OK)
	async deleteUser(@Param("userId", ParseIntPipe) userId: number) {
		await this.adminService.deleteUser(userId);

		return { message: "회원 삭제 성공" };
	}

	@Patch("/user/:userId/restore")
	@HttpCode(HttpStatus.OK)
	async restoreUser(@Param("userId", ParseIntPipe) userId: number) {
		await this.adminService.restoreUser(userId);

		return { message: "회원 복구 성공" };
	}
}
