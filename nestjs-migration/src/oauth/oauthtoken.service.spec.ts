import { Test, TestingModule } from "@nestjs/testing";
import { TOAuthProvider } from "shared";
import { ServerError } from "../common/exceptions/server-error.exception";
import { OAuthPropsConfig } from "./config/oauth-props.config";
import { OAUTH_TOKEN_SERVICE_ERROR_MESSAGES } from "./constants/oauth-token-service.constatns";
import { TOAuthProps } from "./interfaces/oauth.interface";
import { OAuthTokenService } from "./oauthtoken.service";

describe("OAuthTokenService", () => {
	let oAuthTokenService: OAuthTokenService;
	let oAuthPropsConfig: OAuthPropsConfig;

	const mockAuthProps: Partial<Record<TOAuthProvider, TOAuthProps>> = {
		google: {
			clientId: "googleClientId",
			clientSecret: "googleClientSecret",
			scope: "https://www.googleapis.com/auth/userinfo.profile",
			redirectUri: "http://localhost:3000/oauth/redirect/google",
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

				revoke: () => ({
					searchParams: {
						access_type: "offline",
					},
				}),
			},
			reconfirmParams: { prompt: "consent" },
		},
	};

	const mockFetch = jest.fn();

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				OAuthTokenService,
				{
					provide: OAuthPropsConfig,
					useValue: {
						getOAuthProps: jest.fn().mockReturnValue(mockAuthProps),
					},
				},
			],
		}).compile();

		global.fetch = mockFetch;

		oAuthTokenService = module.get<OAuthTokenService>(OAuthTokenService);
		oAuthPropsConfig = module.get<OAuthPropsConfig>(OAuthPropsConfig);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should be defined", () => {
		expect(oAuthTokenService).toBeDefined();
	});

	describe("verifyAuthorizationCode", () => {
		it("토큰과 유저 정보를 정상적으로 반환한다", async () => {
			mockFetch
				.mockResolvedValueOnce({
					ok: true,
					status: 200,
					json: async () => ({
						access_token: "test-access-token",
						refresh_token: "test-refresh-token",
					}),
				})
				.mockResolvedValueOnce({
					ok: true,
					status: 200,
					json: async () => ({
						id: "test-account-id",
					}),
				});

			const result = await oAuthTokenService.verifyAuthorizationCode(
				"google",
				"authorization-code"
			);

			expect(result).toEqual({
				oAuthAccountId: "test-account-id",
				oAuthRefreshToken: "test-refresh-token",
			});
		});

		it("OAuth 서비스 제공사 오류인 경우, ServerError를 반환합니다.", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 500,
			});

			const result = oAuthTokenService.verifyAuthorizationCode(
				"google",
				"authorization-code"
			);

			await expect(result).rejects.toThrow(ServerError);
			await expect(result).rejects.toThrow(
				OAUTH_TOKEN_SERVICE_ERROR_MESSAGES.OAUTH_PROVIDER_ERROR
			);

			expect(mockFetch).toHaveBeenCalledTimes(1);
		});

		it("인가 수단이 유효하지 않은 경우, ServerError를 반환합니다.", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 400,
			});
			const result = oAuthTokenService.verifyAuthorizationCode(
				"google",
				"authorization-code"
			);

			await expect(result).rejects.toThrow(ServerError);

			await expect(result).rejects.toThrow(
				OAUTH_TOKEN_SERVICE_ERROR_MESSAGES.OAUTH_PROVIDER_INVALID
			);

			expect(mockFetch).toHaveBeenCalledTimes(1);
		});
	});
});
