import { oAuthProviders } from "../../oauth/constants";

const oAuthProviderDomain = oAuthProviders.join(", ");

export const ERROR_MESSAGES = {
	INVALID_OAUTH_PROVIDER: `OAuth 서비스 제공사는 ${oAuthProviderDomain} 중 하나여야 합니다.`,
	AUTHORIZATION_CODE_REQUIRED: "Authorization code가 없습니다.",
	INVALID_AUTHORIZATION_CODE: "Authorization code는 string이어야 합니다.",
} as const;
