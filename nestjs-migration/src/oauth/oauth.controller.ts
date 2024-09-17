import { Controller, Get, HttpCode, HttpStatus, Param } from "@nestjs/common";
import { OAuthProviderDto } from "./dto/provider-param.dto";
import { OauthService } from "./oauth.service";

@Controller("oauth")
export class OauthController {
	constructor(private readonly oauthService: OauthService) {}

	@Get("/login-url/:provider")
	@HttpCode(HttpStatus.OK)
	async getLoginUrl(@Param() param: OAuthProviderDto) {
		const provider = param.provider;
		const url = this.oauthService.getOauthUrl("login", provider);

		return { url };
	}
}
