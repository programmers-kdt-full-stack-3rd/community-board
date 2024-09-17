import { Test, TestingModule } from "@nestjs/testing";
import { TOAuthProvider } from "shared";
import { OAuthPropsConfig } from "./config/oauth-props.config";
import { TOAuthProps } from "./constants/oauth.constants";
import { TOAuthLoginType } from "./interfaces/oauth.interface";
import { OAuthService } from "./oauth.service";

describe("OAuthService", () => {
	let oAuthService: OAuthService;
	let oAuthPropsConfig: OAuthPropsConfig;

	const mockProvider: TOAuthProvider = "google";
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

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				OAuthService,
				{
					provide: OAuthPropsConfig,
					useValue: {
						getOAuthProps: jest.fn().mockReturnValue(mockAuthProps),
					},
				},
			],
		}).compile();

		oAuthService = module.get<OAuthService>(OAuthService);
		oAuthPropsConfig = module.get<OAuthPropsConfig>(OAuthPropsConfig);
	});

	it("should be defined", () => {
		expect(oAuthService).toBeDefined();
	});

	describe("getOAuthUrl", () => {
		const verifyUrlParams = (
			url: string,
			expectedParams: Record<string, string>
		) => {
			const parsedUrl = new URL(url);
			Object.entries(expectedParams).forEach(([key, value]) => {
				expect(parsedUrl.searchParams.get(key)).toBe(value);
			});
		};

		it.each([
			["login", "login_type%3Dlogin"],
			["reconfirm", "login_type%3Dreconfirm"],
			["link", "login_type%3Dlink"],
		])(
			"%s 타입에 대해 올바른 OAuth URL을 반환한다",
			(loginType, expectedState) => {
				const url = oAuthService.getOAuthUrl(
					loginType as TOAuthLoginType,
					"google"
				);

				verifyUrlParams(url, {
					response_type: "code",
					client_id: "googleClientId",
					redirect_uri: "http://localhost:3000/oauth/redirect/google",
					scope: "https://www.googleapis.com/auth/userinfo.profile",
					access_type: "offline",
				});

				expect(url).toContain(`state=${expectedState}`);

				if (loginType === "reconfirm") {
					expect(url).toContain("prompt=consent");
				}
			}
		);

		it("생성된 URL이 예상 구조와 일치한다", () => {
			const loginUrl = oAuthService.getOAuthUrl("login", "google");
			expect(loginUrl).toMatchSnapshot();
		});

		it("getAdditionalRequestOptionsFor가 없는 경우에도 정상적으로 동작한다", () => {
			const modifiedMockProps = { ...mockAuthProps };
			delete modifiedMockProps.google.getAdditionalRequestOptionsFor
				.login;

			jest.spyOn(oAuthPropsConfig, "getOAuthProps").mockReturnValue(
				modifiedMockProps as Record<TOAuthProvider, TOAuthProps>
			);

			const url = oAuthService.getOAuthUrl("login", "google");

			const parsedUrl = new URL(url);

			verifyUrlParams(url, {
				response_type: "code",
				client_id: "googleClientId",
				redirect_uri: "http://localhost:3000/oauth/redirect/google",
				scope: "https://www.googleapis.com/auth/userinfo.profile",
			});

			expect(parsedUrl.searchParams.get("access_type")).toBeNull();
		});

		it("searchParams가 없는 경우에도 정상적으로 동작한다", () => {
			const modifiedMockProps = { ...mockAuthProps };
			modifiedMockProps.google.getAdditionalRequestOptionsFor = {
				login: () => ({}),
			};

			jest.spyOn(oAuthPropsConfig, "getOAuthProps").mockReturnValue(
				modifiedMockProps as Record<TOAuthProvider, TOAuthProps>
			);

			const url = oAuthService.getOAuthUrl("reconfirm", "google");

			const parsedUrl = new URL(url);

			verifyUrlParams(url, {
				response_type: "code",
				client_id: "googleClientId",
				redirect_uri: "http://localhost:3000/oauth/redirect/google",
				scope: "https://www.googleapis.com/auth/userinfo.profile",
			});

			expect(parsedUrl.searchParams.get("access_type")).toBeNull();
		});
	});
});
