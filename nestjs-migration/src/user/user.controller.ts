import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Res,
	UseGuards,
} from "@nestjs/common";
import { Response } from "express";
import { User } from "../common/decorator/user.decorator";
import { LoginGuard } from "../common/guard/login.guard";
import { IUserEntity } from "../common/interface/user-entity.interface";
import { RbacService } from "../rbac/rbac.service";
import { getKstNow } from "../utils/date.util";
import { COOKIE_MAX_AGE } from "./constant/user.constants";
import { CheckPasswordDto } from "./dto/check-password.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginDto } from "./dto/login.dto";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly rbacService: RbacService
	) {}

	@Post("join")
	@HttpCode(HttpStatus.CREATED)
	async joinUser(@Body() createUserDto: CreateUserDto) {
		await this.userService.createUser(createUserDto);
		return { message: "회원가입 성공" };
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
			secure: true,
			maxAge: COOKIE_MAX_AGE.accessToken,
		});

		res.cookie("refreshToken", result.refreshToken, {
			httpOnly: true,
			secure: true,
			maxAge: COOKIE_MAX_AGE.refreshToken,
		});

		return {
			message: "로그인 성공",
			result: { nickname: result.nickname, loginTime: getKstNow() },
		};
	}

	@UseGuards(LoginGuard)
	@Post("logout")
	@HttpCode(HttpStatus.OK)
	async logout(
		@User() user: IUserEntity,
		@Res({ passthrough: true }) res: Response
	) {
		const userId = user.userId;

		res.clearCookie("accessToken");
		res.clearCookie("refreshToken");

		await this.userService.logout(userId);
		return { message: "로그아웃 성공" };
	}

	@UseGuards(LoginGuard)
	@Get()
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

	//TODO: 소셜로그인 API 구현후 유저 정보 수정 API 구현

	//TODO: 소설로그인 API 구현후 유저 탈퇴 API 구현

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

		return { message: "비밀번호 확인 성공" };
	}

	@Get("/check-admin")
	@HttpCode(HttpStatus.OK)
	@UseGuards(LoginGuard)
	async checkIsAdmin(@User() user: IUserEntity) {
		const isAdmin = await this.rbacService.isAdmin(user.roleId);
		return { isAdmin };
	}
}
