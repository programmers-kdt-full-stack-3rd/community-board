import { Test, TestingModule } from "@nestjs/testing";
import { TOAuthProvider } from "shared";
import { UpdateResult } from "typeorm";
import { AuthService } from "../auth/auth.service";
import { RefreshTokensRepository } from "../auth/refresh-tokens.repository";
import { ServerError } from "../../common/exceptions/server-error.exception";
import { User } from "../user/entities/user.entity";
import { UserRepository } from "../user/user.repository";
import * as oAuthUtil from "../../utils/oauth.util";
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

	const mockFetch = jest.fn();

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
						makeTempToken: jest.fn(),
					},
				},
				{
					provide: UserRepository,
					useValue: {
						readUserByOAuth: jest.fn(),
						save: jest.fn(),
						findOne: jest.fn(),
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
						getOAuthConnectionByUserId: jest.fn(),
						getOAuthConnectionByProviderAndUserId: jest.fn(),
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
						refreshOAuthAccessToken: jest.fn(),
					},
				},
			],
		}).compile();

		global.fetch = mockFetch;

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

	describe("oAuthReconfirm", () => {
		const moackOAuthAccountId = "oauth-account-id";
		const mockOAuthRefreshToken = "oauth-refresh-token";

		const mockOAuthData = {
			oAuthAccountId: moackOAuthAccountId,
			oAuthRefreshToken: mockOAuthRefreshToken,
		};

		const oAuthLoginDto: OAuthLoginDto = {
			provider: "google",
			code: "code",
		};

		const mockTempToken = "temp-token";

		beforeEach(() => {
			jest.spyOn(
				oAuthTokenService,
				"verifyAuthorizationCode"
			).mockResolvedValue(mockOAuthData);

			jest.spyOn(authService, "makeTempToken").mockReturnValue(
				"temp-token"
			);

			jest.spyOn(
				oAuthConnectionRepository,
				"getOAuthConnectionByProviderAndAccountId"
			).mockResolvedValue({ id: 1 } as OAuthConnection);

			jest.spyOn(oAuthConnectionRepository, "update").mockResolvedValue({
				affected: 1,
			} as UpdateResult);
		});

		describe("성공 케이스", () => {
			it("소셜 로그인 재확인 성공", async () => {
				const mockUser = createMockUser();
				jest.spyOn(userRepository, "readUserByOAuth").mockResolvedValue(
					mockUser
				);

				const result = await oAuthService.oAuthReconfirm(
					oAuthLoginDto,
					1
				);

				expect(result).toEqual({ tempToken: mockTempToken });
			});
		});

		describe("실패 케이스", () => {
			it.each([
				[
					"연동되지 않은 소셜 계정",
					{ id: 2 },
					"로그인한 유저와 연동하지 않은 소셜 계정입니다.",
				],
				[
					"사용자 정보가 올바르지 않은 경우",
					{ id: 1, nickname: null },
					"사용자 정보 오류",
				],
				[
					"이메일, 비밀번호를 등록한 계정",
					{ id: 1, email: "test@email.com" },
					"이메일, 비밀번호를 등록한 계정은 비밀번호 재확인으로 인증해야 합니다.",
				],
			])(
				"%s인 경우 에러를 반환한다.",
				async (_, userOverrides, errorMessage) => {
					const mockUser = createMockUser(userOverrides);

					jest.spyOn(
						userRepository,
						"readUserByOAuth"
					).mockResolvedValue(mockUser);

					const result = oAuthService.oAuthReconfirm(
						oAuthLoginDto,
						1
					);

					await expect(result).rejects.toThrow(ServerError);
					await expect(result).rejects.toThrow(errorMessage);
				}
			);
		});
	});

	describe("oAuthLink", () => {
		const moackOAuthAccountId = "oauth-account-id";
		const mockOAuthRefreshToken = "oauth-refresh-token";

		const mockOAuthData = {
			oAuthAccountId: moackOAuthAccountId,
			oAuthRefreshToken: mockOAuthRefreshToken,
		};

		const oAuthLoginDto: OAuthLoginDto = {
			provider: "google",
			code: "code",
		};

		beforeEach(() => {
			jest.spyOn(
				oAuthTokenService,
				"verifyAuthorizationCode"
			).mockResolvedValue(mockOAuthData);

			jest.spyOn(userRepository, "readUserByOAuth").mockResolvedValue(
				undefined
			);

			jest.spyOn(
				oAuthConnectionRepository,
				"getOAuthConnectionByUserId"
			).mockResolvedValue([
				{
					id: 1,
					oAuthProvider: { name: "naver" },
				},
			] as OAuthConnection[]);

			jest.spyOn(oAuthProviderRepository, "findOne").mockResolvedValue({
				id: 1,
			} as OAuthProvider);
		});

		describe("성공 케이스", () => {
			it("소셜 계정 연동 성공", async () => {
				const result = await oAuthService.oAuthLink(oAuthLoginDto, 1);

				expect(result).toBe(true);
			});
		});

		describe("실패 케이스", () => {
			it("이미 OAuth로 가입한 계정이 있는 경우 에러를 반환한다", async () => {
				jest.spyOn(userRepository, "readUserByOAuth").mockResolvedValue(
					createMockUser()
				);

				const result = oAuthService.oAuthLink(oAuthLoginDto, 1);

				await expect(result).rejects.toThrow(ServerError);
				await expect(result).rejects.toThrow(
					"이미 연동된 소셜 계정입니다."
				);
			});

			it("사용자가 이미 동일한 OAuth 제공자와 연결되어 있는 경우 에러를 반환한다", async () => {
				jest.spyOn(
					oAuthConnectionRepository,
					"getOAuthConnectionByUserId"
				).mockResolvedValue([
					{ id: 1, oAuthProvider: { name: "google" } },
				] as OAuthConnection[]);

				const result = oAuthService.oAuthLink(oAuthLoginDto, 1);

				await expect(result).rejects.toThrow(ServerError);
				await expect(result).rejects.toThrow(
					"이미 연동된 소셜 계정입니다."
				);
			});
		});
	});

	describe("oAuthUnlink", () => {
		const mockOAuthAccessToken = "oauth-access-token";

		beforeEach(() => {
			jest.spyOn(userRepository, "findOne").mockResolvedValue(
				createMockUser({
					email: "test@email.com",
					password: "password",
					salt: "salt",
				})
			);

			jest.spyOn(
				oAuthConnectionRepository,
				"getOAuthConnectionByUserId"
			).mockResolvedValue([
				{
					id: 1,
					oAuthProvider: { name: "google" },
				},
			] as OAuthConnection[]);

			jest.spyOn(
				oAuthTokenService,
				"refreshOAuthAccessToken"
			).mockResolvedValue({
				oAuthAccessToken: mockOAuthAccessToken,
			});

			jest.spyOn(
				oAuthConnectionRepository,
				"getOAuthConnectionByProviderAndUserId"
			).mockResolvedValue({
				id: 1,
			} as OAuthConnection);

			jest.spyOn(oAuthConnectionRepository, "update").mockResolvedValue({
				affected: 1,
			} as UpdateResult);

			mockFetch.mockReset();

			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => ({}),
			});
		});

		describe("성공 케이스", () => {
			it("소셜 계정 연동 해제 성공", async () => {
				const result = await oAuthService.oAuthUnlink("google", 1);

				expect(result).toBe(true);
			});
		});

		describe("실패 케이스", () => {
			it("존재 하지 않은 회원인경우 에러를 반환한다.", async () => {
				jest.spyOn(userRepository, "findOne").mockResolvedValue(null);

				const result = oAuthService.oAuthUnlink("google", 1);

				await expect(result).rejects.toThrow(ServerError);
				await expect(result).rejects.toThrow(
					"존재하지 않은 회원 입니다."
				);
			});

			it("연동되지 않은 소셜 계정인 경우 에러를 반환한다.", async () => {
				jest.spyOn(
					oAuthConnectionRepository,
					"getOAuthConnectionByUserId"
				).mockResolvedValue([
					{
						id: 1,
						oAuthProvider: { name: "naver" },
					},
				] as OAuthConnection[]);

				const result = oAuthService.oAuthUnlink("google", 1);

				await expect(result).rejects.toThrow(ServerError);
				await expect(result).rejects.toThrow(
					"해당 서비스와 소셜 로그인을 연동하지 않았습니다."
				);
			});

			it("이메일 등록 여부 확인 실패시 에러를 반환한다.", async () => {
				jest.spyOn(userRepository, "findOne").mockResolvedValue(
					createMockUser({ email: null })
				);

				const result = oAuthService.oAuthUnlink("google", 1);

				await expect(result).rejects.toThrow(ServerError);
				await expect(result).rejects.toThrow(
					"이메일 등록이 없으므로 마지막 마지막 소셜 연동을 해제할 수 없습니다."
				);
			});

			describe("revokeOAuth", () => {
				it("서비스 제공사 오류로 인해 소셜 연동 해제 실패시 에러를 반환한다.", async () => {
					mockFetch.mockReset();

					mockFetch.mockResolvedValueOnce({
						ok: false,
						status: 500,
						json: async () => ({}),
					});

					const result = oAuthService.oAuthUnlink("google", 1);

					await expect(result).rejects.toThrow(ServerError);
					await expect(result).rejects.toThrow(
						"OAuth 서비스 제공사 오류로 OAuth 연동 해제에 실패했습니다."
					);
				});

				it("인가 수단이 유효하지 않아서 소셜 연동 해제 실패시 에러를 반환한다.", async () => {
					mockFetch.mockReset();

					mockFetch.mockResolvedValueOnce({
						ok: false,
						status: 400,
						json: async () => ({}),
					});

					const result = oAuthService.oAuthUnlink("google", 1);

					await expect(result).rejects.toThrow(ServerError);
					await expect(result).rejects.toThrow(
						"인가 수단이 유효하지 않아서 OAuth 연동 해제에 실패했습니다."
					);
				});

				it("서버 요청 구성문제로 소셜 연동 해제 실패시 에러를 반환한다.", async () => {
					mockFetch.mockReset();

					mockFetch.mockResolvedValueOnce({
						ok: true,
						status: 200,
						json: async () => ({
							error: "invalid_request",
						}),
					});

					const result = oAuthService.oAuthUnlink("google", 1);

					await expect(result).rejects.toThrow(ServerError);
					await expect(result).rejects.toThrow(
						"서버의 요청 구성 문제로 OAuth 연동 해제에 실패했습니다."
					);
				});
			});

			describe("deleteOAuthConnection", () => {
				it("소셜로그인을 연동 하지 않았을 경우 에러를 반환한다.", async () => {
					jest.spyOn(
						oAuthConnectionRepository,
						"getOAuthConnectionByProviderAndUserId"
					).mockResolvedValue(null);

					const result = oAuthService.oAuthUnlink("google", 1);

					await expect(result).rejects.toThrow(ServerError);
					await expect(result).rejects.toThrow(
						"해당 서비스와 소셜 로그인을 연동하지 않았습니다."
					);
				});

				it("소셜로그인 연동 해제 실패시 에러를 반환한다.", async () => {
					jest.spyOn(
						oAuthConnectionRepository,
						"update"
					).mockResolvedValue({ affected: 0 } as UpdateResult);

					const result = oAuthService.oAuthUnlink("google", 1);

					await expect(result).rejects.toThrow(ServerError);
					await expect(result).rejects.toThrow(
						"소셜 로그인 연동 해제에 실패했습니다."
					);
				});
			});
		});
	});
});
