// TODO: 서버 코드에서 oauth 유틸에 있던 `TOAuthLoginType` 대신 아래 내용 import
export const oAuthLoginTypes = ["login", "reconfirm", "link"] as const;
export type TOAuthLoginType = (typeof oAuthLoginTypes)[number];

export const isOAuthLoginType = (value: any): value is TOAuthLoginType => {
	return oAuthLoginTypes.includes(value);
};

export const oAuthProviders = ["google", "kakao", "naver"] as const;
export type TOAuthProvider = (typeof oAuthProviders)[number];

export const isOAuthProvider = (value: any): value is TOAuthProvider => {
	return oAuthProviders.includes(value);
};

export interface IOAuthConnection {
	id: number;
	user_id: number;
	oauth_provider_name: TOAuthProvider;
	oauth_account_id: string;
	oauth_refresh_token: string;
}
