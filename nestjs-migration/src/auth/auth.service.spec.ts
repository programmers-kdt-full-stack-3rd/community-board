import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { RefreshTokens } from "./entity/refresh-tokens.entity";
import { RefreshTokensRepository } from "./refresh-tokens.repository";

describe("AuthService", () => {
	let authService: AuthService;
	let jwtService: JwtService;
	let configService: ConfigService;
	let refreshTokenRepository: RefreshTokensRepository;

	const mockPayload = { userId: 1 };

	const mockRefreshTokenDB: RefreshTokens = {
		id: 1,
		userId: 1,
		token: "mocked_refresh_token",
		expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
	};

	const mockJwtService = {
		sign: jest.fn((payload, options) => {
			// 시크릿 키에 따라 다른 토큰 반환
			if (options.secret === "mock_jwt.access_token_key") {
				return "mocked_access_token";
			} else if (options.secret === "mock_jwt.refresh_token_key") {
				return "mocked_refresh_token";
			} else if (options.secret === "mock_jwt.temp_token_key") {
				return "mocked_temp_token";
			}
			return "unknown_token";
		}),

		verify: jest.fn((token, options) => {
			if (
				token === "mocked_access_token" &&
				options.secret === "mock_jwt.access_token_key"
			) {
				return mockPayload;
			} else if (
				token === "mocked_refresh_token" &&
				options.secret === "mock_jwt.refresh_token_key"
			) {
				return mockPayload;
			} else {
				throw new Error("Invalid token");
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
			const token = authService.makeAccessToken(1);
			expect(token).toEqual("mocked_access_token");
			expect(jwtService.sign).toHaveBeenCalledWith(
				{ userId: 1 },
				{
					secret: "mock_jwt.access_token_key",
					expiresIn: "1h",
				}
			);
		});
	});

	describe("makeRefreshToken", () => {
		it("리프레시 토큰을 성공적으로 생성한다.", () => {
			const token = authService.makeRefreshToken(1);
			expect(token).toEqual("mocked_refresh_token");
			expect(jwtService.sign).toHaveBeenCalledWith(
				{ userId: 1 },
				{
					secret: "mock_jwt.refresh_token_key",
					expiresIn: "1d",
				}
			);
		});
	});

	describe("makeTempToken", () => {
		it("임시 토큰을 성공적으로 생성한다.", () => {
			const token = authService.makeTempToken(1);
			expect(token).toEqual("mocked_temp_token");
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
			const token = authService.verifyAccessToken("mocked_access_token");

			expect(token).toEqual(mockPayload);
			expect(jwtService.verify).toHaveBeenCalledWith(
				"mocked_access_token",
				{
					secret: "mock_jwt.access_token_key",
				}
			);
		});

		it("엑세스 토큰 검증 시 잘못된 토큰이면 에러를 던진다.", () => {
			expect(() =>
				authService.verifyAccessToken("invalid_token")
			).toThrow("Invalid token");
		});
	});

	describe("verifyRefreshToken", () => {
		it("리프레시 토큰을 성공적으로 검증한다.", async () => {
			jest.spyOn(refreshTokenRepository, "findOne").mockResolvedValue(
				mockRefreshTokenDB
			);

			const token = await authService.verifyRefreshToken(
				"mocked_refresh_token"
			);

			expect(token).toEqual(mockPayload);
			expect(jwtService.verify).toHaveBeenCalledWith(
				"mocked_refresh_token",
				{
					secret: "mock_jwt.refresh_token_key",
				}
			);

			expect(refreshTokenRepository.findOne).toHaveBeenCalledWith({
				where: { userId: 1, token: "mocked_refresh_token" },
			});
		});

		it("데이터베이스에 없는 리프레시 토큰에 대해 에러를 던진다", async () => {
			const mockToken = "mocked_refresh_token";

			jest.spyOn(refreshTokenRepository, "findOne").mockResolvedValue(
				null
			);

			await expect(
				authService.verifyRefreshToken(mockToken)
			).rejects.toThrow("잘못된 refresh token 입니다.");
		});

		it("리프레시 토큰 검증 시 잘못된 토큰이면 에러를 던진다.", async () => {
			jest.spyOn(refreshTokenRepository, "findOne").mockResolvedValue(
				mockRefreshTokenDB
			);

			jwtService.verify = jest.fn(() => {
				throw new Error("Invalid token");
			});

			await expect(
				authService.verifyRefreshToken("invalid_token")
			).rejects.toThrow("Invalid token");
		});
	});

	describe("generateTokens", () => {
		it("액세스 토큰과 리프레시 토큰을 성공적으로 생성한다.", () => {
			const tokens = authService.generateTokens(1);
			expect(tokens).toEqual({
				accessToken: "mocked_access_token",
				refreshToken: "mocked_refresh_token",
			});
			expect(jwtService.sign).toHaveBeenCalledWith(
				{ userId: 1 },
				{
					secret: "mock_jwt.access_token_key",
					expiresIn: "1h",
				}
			);
			expect(jwtService.sign).toHaveBeenCalledWith(
				{ userId: 1 },
				{
					secret: "mock_jwt.refresh_token_key",
					expiresIn: "1d",
				}
			);
		});
	});
});
