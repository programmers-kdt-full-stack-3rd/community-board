export type TOAuthTokenRequestGrantType =
	| "authorization_code"
	| "refresh_token";
export type TOAuthLoginType = "login" | "reconfirm" | "link";

interface IOAuthUser {
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
