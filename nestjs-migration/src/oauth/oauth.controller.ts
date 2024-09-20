import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Res,
} from "@nestjs/common";
import { Response } from "express";
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
}
