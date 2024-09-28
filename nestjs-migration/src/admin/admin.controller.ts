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
import { GetLogQueryDto } from "../log/dto/get-log-query.dto";
import { LogService } from "../log/log.service";
import { AdminService } from "./admin.service";
import { GetPostsDto } from "./dto/get-posts.dto";
import { GetStatsQueryDto } from "./dto/get-stats.dto";
import { GetUsersDto } from "./dto/get-users.dto";

@UseGuards(LoginGuard)
@Controller("admin")
@AdminOnly()
export class AdminController {
	constructor(
		private readonly adminService: AdminService,
		private readonly logService: LogService
	) {}

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

	@Get("/post")
	@HttpCode(HttpStatus.OK)
	async getPosts(@Query() getPostsDto: GetPostsDto) {
		const result = await this.adminService.getPosts(getPostsDto);

		return result;
	}

	@Delete("/post/:postId")
	@HttpCode(HttpStatus.OK)
	async deletePost(@Param("postId", ParseIntPipe) postId: number) {
		await this.adminService.deletePost(postId);

		return { message: "게시글 삭제 성공" };
	}

	@Patch("/post/:postId/restore")
	@HttpCode(HttpStatus.OK)
	async restorePost(@Param("postId", ParseIntPipe) postId: number) {
		await this.adminService.restorePost(postId);

		return { message: "게시글 복구 성공" };
	}

	@Patch("/post/:postId/public")
	@HttpCode(HttpStatus.OK)
	async publicPost(@Param("postId", ParseIntPipe) postId: number) {
		await this.adminService.publicPost(postId);

		return { message: "게시글 공개 성공" };
	}

	@Patch("/post/:postId/private")
	@HttpCode(HttpStatus.OK)
	async privatePost(@Param("postId", ParseIntPipe) postId: number) {
		await this.adminService.privatePost(postId);

		return { message: "게시글 비공개 성공" };
	}

	@Get("/log/:userId")
	@HttpCode(HttpStatus.OK)
	async getLogs(
		@Query() getLogQueryDto: GetLogQueryDto,
		@Param("userId", ParseIntPipe) userId: number
	) {
		const result = await this.logService.getLogs(getLogQueryDto, userId);

		return result;
	}

	@Get("/stat")
	@HttpCode(HttpStatus.OK)
	async getStats(@Query() getStatsQueryDto: GetStatsQueryDto) {
		const result = await this.adminService.getStats(getStatsQueryDto);

		return result;
	}

	@Get("/stat/:userId")
	@HttpCode(HttpStatus.OK)
	async getUserStat(@Param("userId", ParseIntPipe) userId: number) {
		const result = await this.adminService.getUserStat(userId);

		return result;
	}
}
