import { HttpStatus } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Response } from "express";
import { TOAuthProvider } from "shared";
import { ServerError } from "../common/exceptions/server-error.exception";
import { IUserEntity } from "../common/interface/user-entity.interface";
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
						oAuthReconfirm: jest.fn(),
						oAuthLink: jest.fn(),
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

	describe("POST oauth/reconfirm", () => {
		const oAuthLoginDto: OAuthLoginDto = {
			provider: "google",
			code: "mock-code",
		};

		const mockResponse = {
			cookie: jest.fn(),
		} as unknown as Response;

		it("재확인 성공 시 200 상태 코드와 tempToken을 반환한다", async () => {
			const mockReconfirmResult = { tempToken: "mock-temp-token" };
			const mockUserEntity: IUserEntity = { userId: 1, roleId: 1 };

			jest.spyOn(oAuthService, "oAuthReconfirm").mockResolvedValue(
				mockReconfirmResult
			);

			const result = await oAuthController.oAuthReconfirm(
				oAuthLoginDto,
				mockResponse,
				mockUserEntity
			);

			expect(oAuthService.oAuthReconfirm).toHaveBeenCalledWith(
				oAuthLoginDto,
				mockUserEntity.userId
			);

			expect(mockResponse.cookie).toHaveBeenCalledTimes(1);
			expect(mockResponse.cookie).toHaveBeenCalledWith(
				"tempToken",
				mockReconfirmResult.tempToken,
				{
					httpOnly: true,
					secure: true,
					maxAge: COOKIE_MAX_AGE.tempToken,
				}
			);

			expect(result).toEqual({
				message: "재확인 성공",
			});
		});
	});

	describe("GET /link-url/:provider", () => {
		it("로그인 URL 생성 후 200 상태 코드와 url을 반환한다.", async () => {
			const httpCode = Reflect.getMetadata(
				"__httpCode__",
				oAuthController.getLinkUrl
			);

			const url = "http://localhost:3000/oauth/redirect/google";

			jest.spyOn(oAuthService, "getOAuthUrl").mockReturnValue(url);

			const result = oAuthController.getLinkUrl({
				provider: mockProvider,
			});

			expect(oAuthService.getOAuthUrl).toHaveBeenCalledWith(
				"link",
				mockProvider
			);
			expect(httpCode).toBe(HttpStatus.OK);
			expect(result).toEqual({ url });
		});
	});

	describe("POST /link", () => {
		const oAuthLoginDto: OAuthLoginDto = {
			provider: "google",
			code: "mock-code",
		};

		const mockUserEntity: IUserEntity = { userId: 1, roleId: 1 };

		it("소셜 계정 연동 성공 시 200 상태 코드와 메시지를 반환한다", async () => {
			const httpCode = Reflect.getMetadata(
				"__httpCode__",
				oAuthController.getLinkUrl
			);

			jest.spyOn(oAuthService, "oAuthLink").mockResolvedValue(true);

			const result = await oAuthController.oAuthLink(
				oAuthLoginDto,
				mockUserEntity
			);

			expect(oAuthService.oAuthLink).toHaveBeenCalledWith(
				oAuthLoginDto,
				mockUserEntity.userId
			);

			expect(httpCode).toBe(HttpStatus.OK);

			expect(result).toEqual({
				message: "소셜 계정 연동 성공",
			});
		});
	});
});
