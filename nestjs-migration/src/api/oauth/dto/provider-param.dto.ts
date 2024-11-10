import { IsIn } from "class-validator";
import { TOAuthProvider, oAuthProviders } from "shared";
import { VALIDATION_ERROR_MESSAGES } from "../constants/oauth.constants";

export class OAuthProviderDto {
	@IsIn(oAuthProviders, {
		message: VALIDATION_ERROR_MESSAGES.INVALID_OAUTH_PROVIDER,
	})
	provider: TOAuthProvider;
}
