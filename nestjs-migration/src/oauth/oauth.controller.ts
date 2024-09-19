import { Controller, Get, HttpCode, HttpStatus, Param } from "@nestjs/common";
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
}
