import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";

describe("AuthService", () => {
	let authService: AuthService;
	let jwtService: JwtService;
	let configService: ConfigService;

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
	};

	const mockConfigService = {
		get: jest.fn(key => `mock_${key}`),
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
			],
		}).compile();

		authService = module.get<AuthService>(AuthService);
		jwtService = module.get<JwtService>(JwtService);
		configService = module.get<ConfigService>(ConfigService);
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
