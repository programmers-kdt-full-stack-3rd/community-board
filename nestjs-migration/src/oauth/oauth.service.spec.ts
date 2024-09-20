import { Test, TestingModule } from "@nestjs/testing";
import { TOAuthProvider } from "shared";
import { UpdateResult } from "typeorm";
import { AuthService } from "../auth/auth.service";
import { RefreshTokensRepository } from "../auth/refresh-tokens.repository";
import { ServerError } from "../common/exceptions/server-error.exception";
import { User } from "../user/entities/user.entity";
import { UserRepository } from "../user/user.repository";
import * as oAuthUtil from "../utils/oauth.util";
import { OAuthPropsConfig } from "./config/oauth-props.config";
import { OAuthLoginDto } from "./dto/oauth-login.dto";
import { OAuthConnection } from "./entities/oauth-connection.entity";
import { OAuthProvider } from "./entities/oauth-provider.entity";
import { TOAuthLoginType, TOAuthProps } from "./interfaces/oauth.interface";
import { OAuthService } from "./oauth.service";
import { OAuthTokenService } from "./oauthtoken.service";
import { OAuthConnectionRepository } from "./repositories/oauth-connection.repository";
import { OAuthProviderRepository } from "./repositories/oauth-provider.repository";

jest.mock("typeorm-transactional", () => ({
	Transactional: () => () => ({}),
}));

describe("OAuthService", () => {
	let oAuthService: OAuthService;
	let oAuthPropsConfig: OAuthPropsConfig;
	let authService: AuthService;
	let userRepository: UserRepository;
	let oAuthProviderRepository: OAuthProviderRepository;
	let oAuthConnectionRepository: OAuthConnectionRepository;
	let refreshTokenRepository: RefreshTokensRepository;
	let oAuthTokenService: OAuthTokenService;

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

	const createMockUser = (overrides: Partial<User> = {}): User => {
		const user = new User();
		return Object.assign(
			user,
			{
				id: 1,
				nickname: "testuser",
			} as User,
			overrides
		);
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
				{
					provide: AuthService,
					useValue: {
						generateTokens: jest.fn(),
					},
				},
				{
					provide: UserRepository,
					useValue: {
						readUserByOAuth: jest.fn(),
						save: jest.fn(),
					},
				},
				{
					provide: OAuthProviderRepository,
					useValue: {
						findOne: jest.fn(),
					},
				},
				{
					provide: OAuthConnectionRepository,
					useValue: {
						getOAuthConnectionByProviderAndAccountId: jest.fn(),
						update: jest.fn(),
						insert: jest.fn(),
					},
				},
				{
					provide: RefreshTokensRepository,
					useValue: {
						save: jest.fn(),
					},
				},
				{
					provide: OAuthTokenService,
					useValue: {
						verifyAuthorizationCode: jest.fn(),
					},
				},
			],
		}).compile();

		oAuthService = module.get<OAuthService>(OAuthService);
		oAuthPropsConfig = module.get<OAuthPropsConfig>(OAuthPropsConfig);
		authService = module.get<AuthService>(AuthService);
		userRepository = module.get<UserRepository>(UserRepository);
		oAuthProviderRepository = module.get<OAuthProviderRepository>(
			OAuthProviderRepository
		);
		oAuthConnectionRepository = module.get<OAuthConnectionRepository>(
			OAuthConnectionRepository
		);
		refreshTokenRepository = module.get<RefreshTokensRepository>(
			RefreshTokensRepository
		);
		oAuthTokenService = module.get<OAuthTokenService>(OAuthTokenService);
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

	describe("oAuthLogin", () => {
		const mockTokens = {
			accessToken: "access-token",
			refreshToken: "refresh-token",
		};

		const moackOAuthAccountId = "oauth-account-id";
		const mockOAuthRefreshToken = "oauth-refresh-token";

		const mockOAuthData = {
			oAuthAccountId: moackOAuthAccountId,
			oAuthRefreshToken: mockOAuthRefreshToken,
		};

		beforeEach(() => {
			jest.spyOn(
				oAuthTokenService,
				"verifyAuthorizationCode"
			).mockResolvedValue(mockOAuthData);

			jest.spyOn(authService, "generateTokens").mockReturnValue(
				mockTokens
			);
		});

		const oAuthLoginDto: OAuthLoginDto = {
			provider: "google",
			code: "code",
		};

		describe("성공 케이스", () => {
			it("기존 사용자 로그인 성공", async () => {
				const mockUser = createMockUser();

				jest.spyOn(userRepository, "readUserByOAuth").mockResolvedValue(
					mockUser
				);

				jest.spyOn(
					oAuthConnectionRepository,
					"getOAuthConnectionByProviderAndAccountId"
				).mockResolvedValue({ id: 1 } as OAuthConnection);

				jest.spyOn(
					oAuthConnectionRepository,
					"update"
				).mockResolvedValue({ affected: 1 } as UpdateResult);

				const result = oAuthService.oAuthLogin(oAuthLoginDto);

				await expect(result).resolves.toEqual({
					nickname: mockUser.nickname,
					accessToken: mockTokens.accessToken,
					refreshToken: mockTokens.refreshToken,
				});
			});

			it("새로운 사용자 로그인 성공", async () => {
				jest.spyOn(userRepository, "readUserByOAuth").mockResolvedValue(
					null
				);

				jest.spyOn(oAuthUtil, "generateNickname").mockReturnValue(
					"testuser"
				);

				jest.spyOn(userRepository, "save").mockResolvedValue(
					createMockUser({ nickname: "testuser" })
				);

				jest.spyOn(
					oAuthProviderRepository,
					"findOne"
				).mockResolvedValue({
					id: 1,
				} as OAuthProvider);

				const result = await oAuthService.oAuthLogin(oAuthLoginDto);

				expect(result).toEqual({
					nickname: "testuser",
					accessToken: mockTokens.accessToken,
					refreshToken: mockTokens.refreshToken,
				});
			});
		});

		describe("실패 케이스", () => {
			it("탈퇴한 회원인 경우 에러를 반환한다", async () => {
				const mockUser = createMockUser({ isDelete: true });
				jest.spyOn(userRepository, "readUserByOAuth").mockResolvedValue(
					mockUser
				);

				const result = oAuthService.oAuthLogin(oAuthLoginDto);

				await expect(result).rejects.toThrow(ServerError);
				await expect(result).rejects.toThrow("탈퇴한 회원입니다.");
			});

			it("연동된 소셜 계정이 없는 경우 에러를 반환한다", async () => {
				const mockUser = createMockUser();

				jest.spyOn(userRepository, "readUserByOAuth").mockResolvedValue(
					mockUser
				);

				jest.spyOn(
					oAuthConnectionRepository,
					"getOAuthConnectionByProviderAndAccountId"
				).mockResolvedValue(null);

				const result = oAuthService.oAuthLogin(oAuthLoginDto);

				await expect(result).rejects.toThrow(ServerError);
				await expect(result).rejects.toThrow(
					"연동된 소셜 계정이 없습니다."
				);
			});

			it("Refresh token 저장에 실패한 경우 에러를 반환한다", async () => {
				const mockUser = createMockUser();

				jest.spyOn(userRepository, "readUserByOAuth").mockResolvedValue(
					mockUser
				);

				jest.spyOn(
					oAuthConnectionRepository,
					"getOAuthConnectionByProviderAndAccountId"
				).mockResolvedValue({ id: 1 } as OAuthConnection);

				jest.spyOn(
					oAuthConnectionRepository,
					"update"
				).mockResolvedValue({ affected: 0 } as UpdateResult);

				const result = oAuthService.oAuthLogin(oAuthLoginDto);

				await expect(result).rejects.toThrow(ServerError);
				await expect(result).rejects.toThrow(
					"OAuth Refresh token 저장 실패"
				);
			});

			it("이미 연동된 소셜 계정인 경우 에러를 반환한다", async () => {
				const mockUser = createMockUser();

				jest.spyOn(userRepository, "readUserByOAuth").mockResolvedValue(
					mockUser
				);

				jest.spyOn(
					oAuthConnectionRepository,
					"getOAuthConnectionByProviderAndAccountId"
				).mockResolvedValue({ id: 1 } as OAuthConnection);

				jest.spyOn(
					oAuthConnectionRepository,
					"update"
				).mockRejectedValue({ code: "ER_DUP_ENTRY" });

				const result = oAuthService.oAuthLogin(oAuthLoginDto);

				await expect(result).rejects.toThrow(ServerError);
				await expect(result).rejects.toThrow(
					"이미 연동된 소셜 계정입니다."
				);
			});

			it("새로운 소셜로그인 유저를 저장 실패 할 경우 에러를 반환한다.", async () => {
				jest.spyOn(userRepository, "readUserByOAuth").mockResolvedValue(
					null
				);

				jest.spyOn(userRepository, "save").mockResolvedValue(null);

				const result = oAuthService.oAuthLogin(oAuthLoginDto);

				await expect(result).rejects.toThrow(ServerError);
				await expect(result).rejects.toThrow(
					"소셜 로그인으로 회원가입 실패"
				);
			});

			it("db에 없는 프로바이더인경우 오류를 반환한다.", async () => {
				jest.spyOn(userRepository, "readUserByOAuth").mockResolvedValue(
					null
				);

				jest.spyOn(userRepository, "save").mockResolvedValue(
					createMockUser()
				);

				jest.spyOn(
					oAuthProviderRepository,
					"findOne"
				).mockResolvedValue(null);

				const result = oAuthService.oAuthLogin(oAuthLoginDto);

				await expect(result).rejects.toThrow(ServerError);
				await expect(result).rejects.toThrow(
					"소셜 로그인 연동에 실패했습니다."
				);
			});

			it("소셜계정으로 회원가입 중 db에 연동된 소셜계정이 있는 경우 에러를 반환한다.", async () => {
				jest.spyOn(userRepository, "readUserByOAuth").mockResolvedValue(
					null
				);

				jest.spyOn(oAuthUtil, "generateNickname").mockReturnValue(
					"testuser"
				);

				jest.spyOn(userRepository, "save").mockResolvedValue(
					createMockUser({ nickname: "testuser" })
				);

				jest.spyOn(
					oAuthProviderRepository,
					"findOne"
				).mockRejectedValue({ code: "ER_DUP_ENTRY" });

				const result = oAuthService.oAuthLogin(oAuthLoginDto);

				await expect(result).rejects.toThrow(ServerError);
				await expect(result).rejects.toThrow(
					"이미 연동된 소셜 계정입니다."
				);
			});

			it("소셜계정으로 회원가입 중 중복된 닉네임이 있는 경우 에러를 반환한다.", async () => {
				jest.spyOn(userRepository, "readUserByOAuth").mockResolvedValue(
					null
				);

				jest.spyOn(userRepository, "save").mockRejectedValue({
					code: "ER_DUP_ENTRY",
				});

				const result = oAuthService.oAuthLogin(oAuthLoginDto);

				await expect(result).rejects.toThrow(ServerError);
				await expect(result).rejects.toThrow(
					"이미 사용 중인 닉네임입니다."
				);
			});

			it("로그인시 user.id가 없는 경우 에러를 반환한다.", async () => {
				const mockUser = createMockUser({ id: null });

				jest.spyOn(userRepository, "readUserByOAuth").mockResolvedValue(
					mockUser
				);

				jest.spyOn(
					oAuthConnectionRepository,
					"getOAuthConnectionByProviderAndAccountId"
				).mockResolvedValue({ id: 1 } as OAuthConnection);

				jest.spyOn(
					oAuthConnectionRepository,
					"update"
				).mockResolvedValue({ affected: 1 } as UpdateResult);

				const result = oAuthService.oAuthLogin(oAuthLoginDto);

				await expect(result).rejects.toThrow(ServerError);
				await expect(result).rejects.toThrow("사용자 정보 오류");
			});

			it("로그인시 user.nickname이 없는 경우 에러를 반환한다.", async () => {
				const mockUser = createMockUser({ nickname: null });

				jest.spyOn(userRepository, "readUserByOAuth").mockResolvedValue(
					mockUser
				);

				jest.spyOn(
					oAuthConnectionRepository,
					"getOAuthConnectionByProviderAndAccountId"
				).mockResolvedValue({ id: 1 } as OAuthConnection);

				jest.spyOn(
					oAuthConnectionRepository,
					"update"
				).mockResolvedValue({ affected: 1 } as UpdateResult);

				const result = oAuthService.oAuthLogin(oAuthLoginDto);

				await expect(result).rejects.toThrow(ServerError);
				await expect(result).rejects.toThrow("사용자 정보 오류");
			});
		});
	});
});
