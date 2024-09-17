import { Module } from "@nestjs/common";
import { OAuthPropsConfig } from "./config/oauth-props.config";
import { OAuthController } from "./oauth.controller";
import { OAuthService } from "./oauth.service";

@Module({
	controllers: [OAuthController],
	providers: [OAuthService, OAuthPropsConfig],
})
export class OAuthModule {}
