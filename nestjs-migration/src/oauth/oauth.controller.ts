import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Res,
	UseGuards,
} from "@nestjs/common";
import { Response } from "express";
import { User } from "../common/decorator/user.decorator";
import { LoginGuard } from "../common/guard/login.guard";
import { IUserEntity } from "../common/interface/user-entity.interface";
import { COOKIE_MAX_AGE } from "../user/constant/user.constants";
import { getKstNow } from "../utils/date.util";
import { OAuthLoginDto } from "./dto/oauth-login.dto";
import { OAuthProviderDto } from "./dto/provider-param.dto";
import { OAuthService } from "./oauth.service";

@Controller("oauth")
export class OAuthController {
	constructor(private readonly oauthService: OAuthService) {}

	@Get("/login-url/:provider")
	@HttpCode(HttpStatus.OK)
	getLoginUrl(@Param() param: OAuthProviderDto) {
		const provider = param.provider;
		const url = this.oauthService.getOAuthUrl("login", provider);

		return { url };
	}

	@Post("/login")
	@HttpCode(HttpStatus.OK)
	async oAuthlogin(
		@Body() oAuthLoginDto: OAuthLoginDto,
		@Res({ passthrough: true }) res: Response
	) {
		const result = await this.oauthService.oAuthLogin(oAuthLoginDto);

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

	@Get("/reconfirm-url/:provider")
	@HttpCode(HttpStatus.OK)
	getReconfirmUrl(@Param() param: OAuthProviderDto) {
		const provider = param.provider;
		const url = this.oauthService.getOAuthUrl("reconfirm", provider);

		return { url };
	}

	@Post("/reconfirm")
	@HttpCode(HttpStatus.OK)
	@UseGuards(LoginGuard)
	async oAuthReconfirm(
		@Body() oAuthLoginDto: OAuthLoginDto,
		@Res({ passthrough: true }) res: Response,
		@User() user: IUserEntity
	) {
		const { tempToken } = await this.oauthService.oAuthReconfirm(
			oAuthLoginDto,
			user.userId
		);

		res.cookie("tempToken", tempToken, {
			httpOnly: true,
			secure: true,
			maxAge: COOKIE_MAX_AGE.tempToken,
		});

		return { message: "재확인 성공" };
	}

	@Get("/link-url/:provider")
	@HttpCode(HttpStatus.OK)
	getLinkUrl(@Param() param: OAuthProviderDto) {
		const provider = param.provider;
		const url = this.oauthService.getOAuthUrl("link", provider);

		return { url };
	}

	@Post("/link")
	@HttpCode(HttpStatus.OK)
	@UseGuards(LoginGuard)
	async oAuthLink(
		@Body() oAuthLoginDto: OAuthLoginDto,
		@User() user: IUserEntity
	) {
		await this.oauthService.oAuthLink(oAuthLoginDto, user.userId);

		return { message: "소셜 계정 연동 성공" };
	}

	@Delete("/link/:provider")
	@HttpCode(HttpStatus.OK)
	@UseGuards(LoginGuard)
	async oAuthUnlink(
		@Param() param: OAuthProviderDto,
		@User() user: IUserEntity
	) {
		const provider = param.provider;

		await this.oauthService.oAuthUnlink(provider, user.userId);

		return { message: "소셜 계정 연동 해제 성공" };
	}
}
