export const oAuthProviders = ["google", "kakao", "naver"] as const;

export type TOAuthProvider = (typeof oAuthProviders)[number];

export interface IOAuthConnection {
	id: number;
	user_id: number;
	oauth_provider_name: TOAuthProvider;
	oauth_account_id: string;
	oauth_refresh_token: string;
}
