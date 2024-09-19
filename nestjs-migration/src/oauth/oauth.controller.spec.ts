import { HttpStatus } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Response } from "express";
import { TOAuthProvider } from "shared";
import { ServerError } from "../common/exceptions/server-error.exception";
import { COOKIE_MAX_AGE } from "../user/constant/user.constants";
import * as dateUtil from "../utils/date.util";
import { OAuthPropsConfig } from "./config/oauth-props.config";
import { OAuthLoginDto } from "./dto/oauth-login.dto";
import { OAuthController } from "./oauth.controller";
import { OAuthService } from "./oauth.service";

describe("OauthController", () => {
	let oAuthController: OAuthController;
	let oAuthService: OAuthService;

	const mockProvider: TOAuthProvider = "google";

	const mockTime = "2024-01-01T00:00:00.000+09:00";

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [OAuthController],
			providers: [
				{
					provide: OAuthService,
					useValue: {
						getOAuthUrl: jest.fn(),
						oAuthLogin: jest.fn(),
					},
				},
				{
					provide: OAuthPropsConfig,
					useValue: {
						getOAuthProps: jest.fn(),
					},
				},
			],
		}).compile();

		oAuthController = module.get<OAuthController>(OAuthController);
		oAuthService = module.get<OAuthService>(OAuthService);

		jest.spyOn(dateUtil, "getKstNow").mockImplementation(() => {
			return mockTime;
		});
	});

	it("should be defined", () => {
		expect(oAuthController).toBeDefined();
	});

	describe("GET oauth/login-url/:provider", () => {
		it("로그인 URL 생성 후 200 상태 코드와 url을 반환한다.", async () => {
			const httpCode = Reflect.getMetadata(
				"__httpCode__",
				oAuthController.getLoginUrl
			);

			const url = "http://localhost:3000/oauth/redirect/google";

			jest.spyOn(oAuthService, "getOAuthUrl").mockReturnValue(url);

			const result = oAuthController.getLoginUrl({
				provider: mockProvider,
			});

			expect(oAuthService.getOAuthUrl).toHaveBeenCalledWith(
				"login",
				mockProvider
			);
			expect(httpCode).toBe(HttpStatus.OK);
			expect(result).toEqual({ url });
		});
	});

	describe("POST oauth/login", () => {
		const oAuthLoginDto: OAuthLoginDto = {
			provider: "google",
			code: "mock-code",
		};

		const mockResponse = {
			cookie: jest.fn(),
		} as unknown as Response;

		it("로그인 성공 시 200 상태 코드와 토큰을 반환한다", async () => {
			const mockLoginResult = {
				accessToken: "mock-access-token",
				refreshToken: "mock-refresh-token",
				nickname: "testuser",
			};

			jest.spyOn(oAuthService, "oAuthLogin").mockResolvedValue(
				mockLoginResult
			);

			const result = await oAuthController.oAuthlogin(
				oAuthLoginDto,
				mockResponse
			);

			expect(oAuthService.oAuthLogin).toHaveBeenCalledWith(oAuthLoginDto);
			expect(mockResponse.cookie).toHaveBeenCalledTimes(2);
			expect(mockResponse.cookie).toHaveBeenCalledWith(
				"accessToken",
				mockLoginResult.accessToken,
				{
					httpOnly: true,
					secure: true,
					maxAge: COOKIE_MAX_AGE.accessToken,
				}
			);
			expect(mockResponse.cookie).toHaveBeenCalledWith(
				"refreshToken",
				mockLoginResult.refreshToken,
				{
					httpOnly: true,
					secure: true,
					maxAge: COOKIE_MAX_AGE.refreshToken,
				}
			);

			expect(result).toEqual({
				message: "로그인 성공",
				result: {
					nickname: mockLoginResult.nickname,
					loginTime: mockTime,
				},
			});
		});

		it("로그인 실패 시 예외를 던진다", async () => {
			const error = ServerError.badRequest("로그인 실패");
			jest.spyOn(oAuthService, "oAuthLogin").mockRejectedValue(error);

			const mockResponse = {
				cookie: jest.fn(),
			} as unknown as Response;

			const result = oAuthController.oAuthlogin(
				oAuthLoginDto,
				mockResponse
			);

			await expect(result).rejects.toThrow(error);
		});
	});

	describe("GET oauth/reconfirm-url/:provider", () => {
		it("재확인 URL 생성 후 200 상태 코드와 url을 반환한다.", async () => {
			const httpCode = Reflect.getMetadata(
				"__httpCode__",
				oAuthController.getReconfirmUrl
			);

			const url = "http://localhost:3000/oauth/redirect/google";

			jest.spyOn(oAuthService, "getOAuthUrl").mockReturnValue(url);

			const result = oAuthController.getReconfirmUrl({
				provider: mockProvider,
			});

			expect(oAuthService.getOAuthUrl).toHaveBeenCalledWith(
				"reconfirm",
				mockProvider
			);
			expect(httpCode).toBe(HttpStatus.OK);
			expect(result).toEqual({ url });
		});
	});
});
