import { Module } from "@nestjs/common";
import { OAuthPropsConfig } from "./config/oauth-props.config";
import { OauthController } from "./oauth.controller";
import { OauthService } from "./oauth.service";

@Module({
	controllers: [OauthController],
	providers: [OauthService, OAuthPropsConfig],
})
export class OauthModule {}
