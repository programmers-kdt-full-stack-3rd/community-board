import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { AUTH_ERROR_MESSAGES } from "./constants/auth.constants";
import { RefreshTokens } from "./entity/refresh-tokens.entity";
import { ITokenPayload } from "./interfaces/token.interface";
import { RefreshTokensRepository } from "./refresh-tokens.repository";

describe("AuthService", () => {
	let authService: AuthService;
	let jwtService: JwtService;
	let configService: ConfigService;
	let refreshTokenRepository: RefreshTokensRepository;

	const mockUserId = 1;
	const mockPayload: ITokenPayload = { userId: mockUserId, roleId: 2 };
	const mockAccessToken = "mock_access_token";
	const mockRefreshToken = "mock_refresh_token";
	const mockTempToken = "mock_temp_token";

	const mockRefreshTokenDB: RefreshTokens = {
		id: 1,
		userId: mockUserId,
		token: mockRefreshToken,
		expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
	};

	const mockJwtService = {
		sign: jest.fn((payload, options) => {
			// 시크릿 키에 따라 다른 토큰 반환
			if (options.secret === "mock_jwt.access_token_key") {
				return mockAccessToken;
			} else if (options.secret === "mock_jwt.refresh_token_key") {
				return mockRefreshToken;
			} else if (options.secret === "mock_jwt.temp_token_key") {
				return mockTempToken;
			}
			return "unknown_token";
		}),

		verify: jest.fn((token, options) => {
			if (
				token === mockAccessToken &&
				options.secret === "mock_jwt.access_token_key"
			) {
				return mockPayload;
			} else if (
				token === mockRefreshToken &&
				options.secret === "mock_jwt.refresh_token_key"
			) {
				return mockPayload;
			} else {
				throw new Error(AUTH_ERROR_MESSAGES.INVALID_TOKEN_ERROR);
			}
		}),
	};

	const mockConfigService = {
		get: jest.fn(key => `mock_${key}`),
	};

	const mockRefreshTokensRepository = {
		findOne: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: JwtService,
					useValue: mockJwtService,
				},
				{
					provide: ConfigService,
					useValue: mockConfigService,
				},
				{
					provide: RefreshTokensRepository,
					useValue: mockRefreshTokensRepository,
				},
			],
		}).compile();

		authService = module.get<AuthService>(AuthService);
		jwtService = module.get<JwtService>(JwtService);
		configService = module.get<ConfigService>(ConfigService);
		refreshTokenRepository = module.get<RefreshTokensRepository>(
			RefreshTokensRepository
		);
	});

	describe("makeAccessToken", () => {
		it("엑세스 토큰을 성공적으로 생성한다.", () => {
			const token = authService.makeAccessToken(mockPayload);
			expect(token).toEqual(mockAccessToken);
			expect(jwtService.sign).toHaveBeenCalledWith(mockPayload, {
				secret: "mock_jwt.access_token_key",
				expiresIn: "1h",
			});
		});
	});

	describe("makeRefreshToken", () => {
		it("리프레시 토큰을 성공적으로 생성한다.", () => {
			const token = authService.makeRefreshToken(mockPayload);
			expect(token).toEqual(mockRefreshToken);
			expect(jwtService.sign).toHaveBeenCalledWith(mockPayload, {
				secret: "mock_jwt.refresh_token_key",
				expiresIn: "1d",
			});
		});
	});

	describe("makeTempToken", () => {
		it("임시 토큰을 성공적으로 생성한다.", () => {
			const token = authService.makeTempToken(1);
			expect(token).toEqual(mockTempToken);
			expect(jwtService.sign).toHaveBeenCalledWith(
				{ userId: 1 },
				{
					secret: "mock_jwt.temp_token_key",
					expiresIn: "1h",
				}
			);
		});
	});

	describe("verifyAccessToken", () => {
		it("엑세스 토큰을 성공적으로 검증한다.", () => {
			const token = authService.verifyAccessToken(mockAccessToken);

			expect(token).toEqual(mockPayload);
			expect(jwtService.verify).toHaveBeenCalledWith(mockAccessToken, {
				secret: "mock_jwt.access_token_key",
			});
		});

		it("엑세스 토큰 검증 시 잘못된 토큰이면 에러를 던진다.", () => {
			expect(() =>
				authService.verifyAccessToken("invalid_token")
			).toThrow(AUTH_ERROR_MESSAGES.INVALID_TOKEN_ERROR);
		});
	});

	describe("verifyRefreshToken", () => {
		it("리프레시 토큰을 성공적으로 검증한다.", async () => {
			jest.spyOn(refreshTokenRepository, "findOne").mockResolvedValue(
				mockRefreshTokenDB
			);

			const token =
				await authService.verifyRefreshToken(mockRefreshToken);

			expect(token).toEqual(mockPayload);
			expect(jwtService.verify).toHaveBeenCalledWith(mockRefreshToken, {
				secret: "mock_jwt.refresh_token_key",
			});

			expect(refreshTokenRepository.findOne).toHaveBeenCalledWith({
				where: { userId: 1, token: mockRefreshToken },
			});
		});

		it("데이터베이스에 없는 리프레시 토큰에 대해 에러를 던진다", async () => {
			const mockToken = mockRefreshToken;

			jest.spyOn(refreshTokenRepository, "findOne").mockResolvedValue(
				null
			);

			await expect(
				authService.verifyRefreshToken(mockToken)
			).rejects.toThrow(AUTH_ERROR_MESSAGES.INVALID_REFRESH_TOKEN_ERROR);
		});

		it("리프레시 토큰 검증 시 잘못된 토큰이면 에러를 던진다.", async () => {
			jest.spyOn(refreshTokenRepository, "findOne").mockResolvedValue(
				mockRefreshTokenDB
			);

			jwtService.verify = jest.fn(() => {
				throw new Error(AUTH_ERROR_MESSAGES.INVALID_TOKEN_ERROR);
			});

			await expect(
				authService.verifyRefreshToken("invalid_token")
			).rejects.toThrow(AUTH_ERROR_MESSAGES.INVALID_TOKEN_ERROR);
		});
	});

	describe("generateTokens", () => {
		it("액세스 토큰과 리프레시 토큰을 성공적으로 생성한다.", () => {
			const tokens = authService.generateTokens(mockPayload);
			expect(tokens).toEqual({
				accessToken: mockAccessToken,
				refreshToken: mockRefreshToken,
			});
			expect(jwtService.sign).toHaveBeenCalledWith(mockPayload, {
				secret: "mock_jwt.access_token_key",
				expiresIn: "1h",
			});
			expect(jwtService.sign).toHaveBeenCalledWith(mockPayload, {
				secret: "mock_jwt.refresh_token_key",
				expiresIn: "1d",
			});
		});
	});
});
