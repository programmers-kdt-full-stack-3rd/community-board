import { TOAuthProvider, oAuthProviders } from "shared";

const oAuthProviderDomain = oAuthProviders.join(", ");
export const VALIDATION_ERROR_MESSAGES = {
	INVALID_OAUTH_PROVIDER: `OAuth 서비스 제공사는 ${oAuthProviderDomain} 중 하나여야 합니다.`,
	AUTHORIZATION_CODE_REQUIRED: "Authorization code가 없습니다.",
	INVALID_AUTHORIZATION_CODE: "Authorization code는 string이어야 합니다.",
};
export type TOAuthVariable<T> = {
	[provider in TOAuthProvider]: T;
};

export type TOAuthRequestType = "login" | "token" | "user" | "revoke";

export interface IKeyValuePairs {
	[key: string]: string;
}

export type TOAuthProps = {
	clientId: string;
	clientSecret?: string;

	scope?: string;
	redirectUri: string;

	requestEndpoint: {
		[key in TOAuthRequestType]: string;
	};

	getAdditionalRequestOptionsFor?: {
		[key in TOAuthRequestType]?: (options?: any) => {
			headers?: IKeyValuePairs;
			searchParams?: IKeyValuePairs;
			body?: IKeyValuePairs;
		};
	};

	reconfirmParams: IKeyValuePairs;
};

export const oAuthRequestContentType =
	"application/x-www-form-urlencoded;charset=utf-8";
