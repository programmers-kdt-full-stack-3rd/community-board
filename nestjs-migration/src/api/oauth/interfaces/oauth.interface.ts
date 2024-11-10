import { TOAuthProvider } from "shared";

export type TOAuthTokenRequestGrantType =
	| "authorization_code"
	| "refresh_token";
export type TOAuthLoginType = "login" | "reconfirm" | "link";

export interface IOAuthUser {
	id: string;
}

export interface INaverUser {
	response: IOAuthUser;
}

export interface IOAuthTokens {
	token_type: string;
	access_token: string;
	id_token?: string;
	expires_in: number;
	refresh_token: string;
	refresh_token_expires_in?: number;
	scope?: string;
}

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
