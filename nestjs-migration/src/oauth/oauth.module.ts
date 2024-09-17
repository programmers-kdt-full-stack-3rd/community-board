import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { UserRepository } from "../user/user.repository";
import { OAuthPropsConfig } from "./config/oauth-props.config";
import { OAuthController } from "./oauth.controller";
import { OAuthService } from "./oauth.service";
import { OAuthConnectionRepository } from "./repositories/oauth-connection.repository";
import { OAuthProviderRepository } from "./repositories/oauth-provider.repository";

@Module({
	imports: [AuthModule],
	controllers: [OAuthController],
	providers: [
		OAuthService,
		OAuthPropsConfig,
		OAuthConnectionRepository,
		OAuthProviderRepository,
		UserRepository,
	],
})
export class OAuthModule {}
