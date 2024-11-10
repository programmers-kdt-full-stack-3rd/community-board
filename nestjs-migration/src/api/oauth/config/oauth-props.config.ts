import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TOAuthProvider } from "shared";
import { oAuthRequestContentType } from "../constants/oauth.constants";
import { TOAuthProps } from "../interfaces/oauth.interface";

@Injectable()
export class OAuthPropsConfig {
	constructor(private readonly configService: ConfigService) {}

	getOAuthProps(): Record<TOAuthProvider, TOAuthProps> {
		const getRedirectUri = (provider: TOAuthProvider) => {
			const port = this.configService.get<string>("app.port");
			const baseUrl = `http://localhost:${port}/oauth/redirect`;

			return `${baseUrl}/${provider}`;
		};

		const googleClientId = this.configService.get<string>(
			"oauth.google.client_id"
		);
		const googleClientSecret = this.configService.get<string>(
			"oauth.google.client_secret"
		);

		const kakaoClientId = this.configService.get<string>(
			"oauth.kakao.client_id"
		);
		const kakaoClientSecret = this.configService.get<string>(
			"oauth.kakao.client_secret"
		);

		const naverClientId = this.configService.get<string>(
			"oauth.naver.client_id"
		);
		const naverClientSecret = this.configService.get<string>(
			"oauth.naver.client_secret"
		);

		return {
			google: {
				clientId: googleClientId,
				clientSecret: googleClientSecret,

				scope: "https://www.googleapis.com/auth/userinfo.profile",
				redirectUri: getRedirectUri("google"),

				requestEndpoint: {
					login: "https://accounts.google.com/o/oauth2/v2/auth",
					token: "https://oauth2.googleapis.com/token",
					user: "https://www.googleapis.com/oauth2/v2/userinfo",
					revoke: "https://oauth2.googleapis.com/revoke",
				},

				getAdditionalRequestOptionsFor: {
					login: () => ({
						searchParams: {
							access_type: "offline",
						},
					}),

					revoke: ({ accessToken }: { accessToken: string }) => ({
						searchParams: {
							token: accessToken,
						},
					}),
				},

				reconfirmParams: {
					prompt: "consent",
				},
			},

			kakao: {
				clientId: kakaoClientId,
				clientSecret: kakaoClientSecret,

				redirectUri: getRedirectUri("kakao"),

				requestEndpoint: {
					login: "https://kauth.kakao.com/oauth/authorize",
					token: "https://kauth.kakao.com/oauth/token",
					user: "https://kapi.kakao.com/v2/user/me",
					revoke: "https://kapi.kakao.com/v1/user/unlink",
				},

				getAdditionalRequestOptionsFor: {
					revoke: ({ accessToken }: { accessToken: string }) => ({
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}),
				},

				reconfirmParams: {
					prompt: "login",
				},
			},

			naver: {
				clientId: naverClientId,
				clientSecret: naverClientSecret,

				redirectUri: getRedirectUri("naver"),

				requestEndpoint: {
					login: "https://nid.naver.com/oauth2.0/authorize",
					token: "https://nid.naver.com/oauth2.0/token",
					user: "https://openapi.naver.com/v1/nid/me",
					revoke: "https://nid.naver.com/oauth2.0/token",
				},

				getAdditionalRequestOptionsFor: {
					revoke: ({ accessToken }: { accessToken: string }) => ({
						headers: {
							"Content-type": oAuthRequestContentType,
						},
						body: {
							grant_type: "delete",
							client_id: naverClientId,
							client_secret: naverClientSecret,
							access_token: accessToken,
						},
					}),
				},

				reconfirmParams: {
					auth_type: "reauthenticate",
				},
			},
		};
	}
}
