import { IsIn, IsNotEmpty, IsString } from "class-validator";
import { TOAuthProvider, oAuthProviders } from "shared";
import { VALIDATION_ERROR_MESSAGES } from "../constants/oauth.constants";

export class OAuthLoginDto {
	@IsIn(oAuthProviders, {
		message: VALIDATION_ERROR_MESSAGES.INVALID_OAUTH_PROVIDER,
	})
	provider: TOAuthProvider;

	@IsNotEmpty({
		message: VALIDATION_ERROR_MESSAGES.AUTHORIZATION_CODE_REQUIRED,
	})
	@IsString({
		message: VALIDATION_ERROR_MESSAGES.INVALID_AUTHORIZATION_CODE,
	})
	code: string;
}
