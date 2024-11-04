import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Patch,
	Post,
	Put,
	Req,
	Res,
	UseGuards,
} from "@nestjs/common";
import { Request, Response } from "express";
import { Permissions } from "../common/decorator/rbac.decorator";
import { RequiredPassword } from "../common/decorator/required-password.decorator";
import { User } from "../common/decorator/user.decorator";
import { LoginGuard } from "../common/guard/login.guard";
import { PasswordGuard } from "../common/guard/password.guard";
import { IUserEntity } from "../common/interface/user-entity.interface";
import { RbacService } from "../rbac/rbac.service";
import { getKstNow } from "../utils/date.util";
import { COOKIE_MAX_AGE } from "./constant/user.constants";
import { CheckPasswordDto } from "./dto/check-password.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginDto } from "./dto/login.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserService } from "./user.service";

@Controller("user")
@UseGuards(PasswordGuard)
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly rbacService: RbacService
	) {}

	@Post("join")
	@HttpCode(HttpStatus.CREATED)
	async joinUser(@Body() createUserDto: CreateUserDto) {
		await this.userService.createUser(createUserDto);
		return { error: "", success: true };
	}

	@Post("login")
	@HttpCode(HttpStatus.OK)
	async login(
		@Body() loginDto: LoginDto,
		@Res({ passthrough: true }) res: Response
	) {
		const result = await this.userService.login(loginDto);
		res.cookie("accessToken", result.accessToken, {
			httpOnly: true,
			// http는 secure 사용 x
			// secure: true,
			maxAge: COOKIE_MAX_AGE.accessToken,
		});

		res.cookie("refreshToken", result.refreshToken, {
			httpOnly: true,
			// secure: true,
			maxAge: COOKIE_MAX_AGE.refreshToken,
		});

		return {
			error: "",
			userInfo: {
				nickname: result.nickname,
				email: result.email,
				imgUrl: result.imgUrl,
				loginTime: getKstNow(),
			},
		};
	}

	@UseGuards(LoginGuard)
	@Post("logout")
	@HttpCode(HttpStatus.OK)
	async logout(
		@Req() req: Request,
		@User() user: IUserEntity,
		@Res({ passthrough: true }) res: Response
	) {
		const refreshToken = req.cookies.refreshToken;
		const userId = user.userId;

		res.clearCookie("accessToken");
		res.clearCookie("refreshToken");

		await this.userService.logout(userId, refreshToken);
		return { error: "", success: true };
	}

	@UseGuards(LoginGuard)
	@Get()
	@Permissions("read:user")
	@HttpCode(HttpStatus.OK)
	async readUser(@User() userEntity: IUserEntity) {
		const userId = userEntity.userId;

		const { user, oAuthConnections } =
			await this.userService.readUser(userId);

		return {
			email: user.email,
			nickname: user.nickname,
			connected_oauth: oAuthConnections.map(
				({ oAuthProvider }) => oAuthProvider.name
			),
		};
	}

	@Put()
	@HttpCode(HttpStatus.OK)
	@UseGuards(LoginGuard)
	@RequiredPassword()
	@Permissions("update:user")
	async updateUser(
		@User() userEntity: IUserEntity,
		@Body() updateUserDto: UpdateUserDto
	) {
		const userId = userEntity.userId;

		await this.userService.updateUser(userId, updateUserDto);

		return { error: "", success: true };
	}

	@Delete()
	@HttpCode(HttpStatus.OK)
	@UseGuards(LoginGuard)
	@RequiredPassword()
	@Permissions("delete:user")
	async deleteUser(
		@User() userEntity: IUserEntity,
		@Res({ passthrough: true }) res: Response
	) {
		const userId = userEntity.userId;

		await this.userService.deleteUser(userId);

		res.clearCookie("accessToken");
		res.clearCookie("refreshToken");

		return { message: "회원탈퇴 성공" };
	}

	@Post("/check-password")
	@HttpCode(HttpStatus.OK)
	async checkPassword(
		@User() user: IUserEntity,
		@Res({ passthrough: true }) res: Response,
		@Body() checkPasswordDto: CheckPasswordDto
	) {
		const userId = user.userId;
		const result = await this.userService.checkPassword(
			userId,
			checkPasswordDto.password
		);

		res.cookie("tempToken", result.tempToken, {
			httpOnly: true,
			secure: true,
			maxAge: COOKIE_MAX_AGE.tempToken,
		});

		return { error: "", success: true };
	}

	@Post("/check-duplicate")
	@HttpCode(HttpStatus.OK)
	async checkUser(
		@Body() checkNicknameDto: { nickname?: string; email?: string }
	) {
		const result = await this.userService.checkUser(
			checkNicknameDto.nickname,
			checkNicknameDto.email
		);

		return { error: "", isDuplicated: result };
	}

	@Get("/check-admin")
	@HttpCode(HttpStatus.OK)
	@UseGuards(LoginGuard)
	async checkIsAdmin(@User() user: IUserEntity) {
		const isAdmin = await this.rbacService.isAdmin(user.roleId);
		return { isAdmin };
	}

	@Patch("/profile")
	@HttpCode(HttpStatus.OK)
	async updateProfile(
		@User() userEntity: IUserEntity,
		@Body() updateProfileDto: { nickname?: string; imgUrl?: string }
	) {
		const userId = userEntity.userId;
		const success = await this.userService.updateProfile(
			userId,
			updateProfileDto.nickname,
			updateProfileDto.imgUrl
		);

		return { error: "", success: success };
	}

	@Patch("/password")
	@HttpCode(HttpStatus.OK)
	async updatePassword(
		@User() userEntity: IUserEntity,
		@Body()
		updatePasswordDto: { originPassword: string; newPassword: string }
	) {
		const userId = userEntity.userId;

		// token !== undefined -> 검사 통과
		await this.userService.updatePassword(
			userId,
			updatePasswordDto.originPassword,
			updatePasswordDto.newPassword
		);

		return { message: "비밀번호 변경 성공" };
	}
}
