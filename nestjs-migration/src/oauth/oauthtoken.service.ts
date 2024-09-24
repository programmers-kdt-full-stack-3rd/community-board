import { Injectable } from "@nestjs/common";
import { TOAuthProvider } from "shared";
import { ServerError } from "../common/exceptions/server-error.exception";
import {
	buildTokenFetchOptions,
	extractOAuthAccountId,
} from "../utils/oauth.util";
import { OAuthPropsConfig } from "./config/oauth-props.config";
import { OAUTH_TOKEN_SERVICE_ERROR_MESSAGES } from "./constants/oauth-token-service.constatns";
import { oAuthRequestContentType } from "./constants/oauth.constants";
import {
	IOAuthTokens,
	TOAuthTokenRequestGrantType,
} from "./interfaces/oauth.interface";

@Injectable()
export class OAuthTokenService {
	constructor(private oAuthPropsConfig: OAuthPropsConfig) {}

	private get oAuthProps() {
		return this.oAuthPropsConfig.getOAuthProps();
	}

	async verifyAuthorizationCode(
		provider: TOAuthProvider,
		authorizationCode: string
	) {
		const oAuthTokens = await this.fetchOAuthTokens(
			provider,
			"authorization_code",
			authorizationCode
		);

		const oAuthUser = await this.fetchOAuthUserByAccessToken(
			provider,
			oAuthTokens.access_token
		);

		return {
			oAuthAccountId: extractOAuthAccountId(provider, oAuthUser),
			oAuthRefreshToken: oAuthTokens.refresh_token,
		};
	}

	async refreshOAuthAccessToken(
		provider: TOAuthProvider,
		oAuthRefreshToken: string
	) {
		const oAuthTokens = await this.fetchOAuthTokens(
			provider,
			"refresh_token",
			oAuthRefreshToken
		);
		return {
			oAuthAccessToken: oAuthTokens.access_token,
		};
	}

	private async fetchOAuthTokens(
		provider: TOAuthProvider,
		grantType: TOAuthTokenRequestGrantType,
		grantValue: string
	) {
		const oAuthTokenResponse = await fetch(
			this.oAuthProps[provider].requestEndpoint.token,
			buildTokenFetchOptions(
				provider,
				grantType,
				grantValue,
				this.oAuthProps
			)
		);

		if (oAuthTokenResponse.status >= 500) {
			throw ServerError.etcError(
				500,
				OAUTH_TOKEN_SERVICE_ERROR_MESSAGES.OAUTH_PROVIDER_ERROR
			);
		} else if (oAuthTokenResponse.status >= 400) {
			throw ServerError.badRequest(
				OAUTH_TOKEN_SERVICE_ERROR_MESSAGES.OAUTH_PROVIDER_INVALID
			);
		}

		return (await oAuthTokenResponse.json()) as IOAuthTokens;
	}

	private async fetchOAuthUserByAccessToken(
		provider: TOAuthProvider,
		accessToken: string
	) {
		const url = this.oAuthProps[provider].requestEndpoint.user;
		const headers = {
			Authorization: `Bearer ${accessToken}`,
			"Content-type": oAuthRequestContentType,
		};

		const oAuthUserResponse = await fetch(url, { headers });
		return await oAuthUserResponse.json();
	}
}
