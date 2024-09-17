import { Injectable } from "@nestjs/common";
import { stringify } from "node:querystring";
import { TOAuthProvider } from "shared";
import { OAuthPropsConfig } from "./config/oauth-props.config";
import { TOAuthLoginType } from "./interfaces/oauth.interface";

@Injectable()
export class OAuthService {
	constructor(private oAuthPropsConfig: OAuthPropsConfig) {}

	getOAuthUrl(loginType: TOAuthLoginType, provider: TOAuthProvider) {
		const { [loginType]: url } = this.buildLoginUrl(provider);

		return url;
	}

	private buildOAuthState = (loginType: TOAuthLoginType) => {
		return stringify({
			login_type: loginType,
		});
	};

	private buildLoginUrl(provider: TOAuthProvider): {
		[key in TOAuthLoginType]: string;
	} {
		const {
			requestEndpoint,
			clientId,
			redirectUri,
			scope,
			getAdditionalRequestOptionsFor,
			reconfirmParams,
		} = this.oAuthPropsConfig.getOAuthProps()[provider];

		const loginUrl = new URL(requestEndpoint.login);

		loginUrl.searchParams.set("response_type", "code");
		loginUrl.searchParams.set("client_id", clientId);
		loginUrl.searchParams.set("redirect_uri", redirectUri);
		loginUrl.searchParams.set("state", this.buildOAuthState("login"));

		if (scope) {
			loginUrl.searchParams.set("scope", scope);
		}

		if (getAdditionalRequestOptionsFor?.login) {
			const { searchParams = {} } =
				getAdditionalRequestOptionsFor.login();

			for (const key in searchParams) {
				loginUrl.searchParams.set(key, searchParams[key]);
			}
		}

		const reconfirmUrl = new URL(loginUrl);
		reconfirmUrl.searchParams.set(
			"state",
			this.buildOAuthState("reconfirm")
		);
		for (const key in reconfirmParams) {
			reconfirmUrl.searchParams.set(key, reconfirmParams[key]);
		}

		const linkUrl = new URL(loginUrl);
		linkUrl.searchParams.set("state", this.buildOAuthState("link"));

		return {
			login: loginUrl.toString(),
			reconfirm: reconfirmUrl.toString(),
			link: linkUrl.toString(),
		};
	}
}
