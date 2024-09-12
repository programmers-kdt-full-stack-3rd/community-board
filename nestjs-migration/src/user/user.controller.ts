import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Req,
	Res,
	UseGuards,
} from "@nestjs/common";
import { Request, Response } from "express";
import { LoginGuard } from "../common/guard/login.guard";
import { getKstNow } from "../utils/date.util";
import { CheckPasswordDto } from "./dto/check-password.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginDto } from "./dto/login.dto";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post("join")
	@HttpCode(HttpStatus.CREATED)
	async joinUser(@Body() createUserDto: CreateUserDto) {
		await this.userService.createUser(createUserDto);
		return { message: "회원가입 성공" };
	}

	//TODO: accessToken, refreshToken 만료기한 재설정

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
			expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
		});

		res.cookie("refreshToken", result.refreshToken, {
			httpOnly: true,
			secure: true,
			expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
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
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response
	) {
		const userId = req.user["userId"];

		res.clearCookie("accessToken");
		res.clearCookie("refreshToken");

		await this.userService.logout(userId);
		return { message: "로그아웃 성공" };
	}

	//TODO: 소셜로그인 API 구현 후 유저 정보 읽기 API 구현

	//TODO: 소셜로그인 API 구현후 유저 정보 수정 API 구현

	//TODO: 소설로그인 API 구현후 유저 탈퇴 API 구현

	@UseGuards(LoginGuard)
	@Post("/check-password")
	@HttpCode(HttpStatus.OK)
	async checkPassword(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
		@Body() checkPasswordDto: CheckPasswordDto
	) {
		const userId = req.user["userId"];
		const result = await this.userService.checkPassword(
			userId,
			checkPasswordDto.password
		);

		res.cookie("tempToken", result.tempToken, {
			httpOnly: true,
			secure: true,
			maxAge: 1000 * 60 * 60, //1시간,
		});

		return { message: "비밀번호 확인 성공" };
	}

	@UseGuards(LoginGuard)
	@Get("test")
	@HttpCode(HttpStatus.OK)
	async test() {
		return { message: "테스트 성공" };
	}
}
