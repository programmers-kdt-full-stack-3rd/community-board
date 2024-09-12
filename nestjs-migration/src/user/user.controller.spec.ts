import { Test, TestingModule } from "@nestjs/testing";
import { Response } from "express";
import { ServerError } from "../common/exceptions/server-error.exception";
import { LoginGuard } from "../common/guard/login.guard";
import * as dateUtil from "../utils/date.util";
import { COOKIE_MAX_AGE, USER_ERROR_MESSAGES } from "./constant/user.constants";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

describe("UserController", () => {
	let userController: UserController;
	let userService: UserService;
	let loginGuard: LoginGuard;

	const mockUserService = {
		login: jest.fn(),
		createUser: jest.fn(),
		logout: jest.fn(),
	};

	const mockTime = "2024-01-01T00:00:00.000+09:00";

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UserController],
			providers: [
				{
					provide: UserService,
					useValue: mockUserService,
				},
				LoginGuard,
			],
		}).compile();

		userController = module.get<UserController>(UserController);
		userService = module.get<UserService>(UserService);
		loginGuard = module.get<LoginGuard>(LoginGuard);

		jest.spyOn(dateUtil, "getKstNow").mockImplementation(() => {
			return mockTime;
		});
	});

	describe("Guard 테스트", () => {
		const checkGuardApplied = (methodName: string) => {
			it(`should have LoginGuard applied to ${methodName} method`, () => {
				const guards = Reflect.getMetadata(
					"__guards__",
					UserController.prototype[methodName]
				);
				expect(guards).toBeDefined();
				expect(guards).toContain(LoginGuard);
			});
		};

		checkGuardApplied("logout");
	});

	describe("POST /user/join", () => {
		const createUserDto: CreateUserDto = {
			email: "test@example.com",
			password: "password123",
			nickname: "testuser",
		};
		it("사용자 생성 성공 시 201 상태 코드와 성공 메시지를 반환한다", async () => {
			jest.spyOn(userService, "createUser").mockResolvedValue(undefined);

			const result = await userController.joinUser(createUserDto);

			expect(result).toEqual({ message: "회원가입 성공" });
			expect(userService.createUser).toHaveBeenCalledWith(createUserDto);
		});

		it("사용자 생성 중에 에러 발생 시 예외를 던진다", async () => {
			const error = ServerError.badRequest(
				USER_ERROR_MESSAGES.DUPLICATE_EMAIL
			);
			jest.spyOn(userService, "createUser").mockRejectedValue(error);

			await expect(
				userController.joinUser(createUserDto)
			).rejects.toThrow(error);
		});
	});

	describe("POST /user/login", () => {
		const loginDto = {
			email: "test@example.com",
			password: "password123",
		};
		it("로그인 성공 시 200 상태 코드와 토큰을 반환한다", async () => {
			const mockLoginResult = {
				accessToken: "mock-access-token",
				refreshToken: "mock-refresh-token",
				nickname: "testuser",
			};

			const mockResponse = {
				cookie: jest.fn(),
			} as unknown as Response;

			jest.spyOn(userService, "login").mockResolvedValue(mockLoginResult);

			const result = await userController.login(loginDto, mockResponse);

			expect(userService.login).toHaveBeenCalledWith(loginDto);
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
			const error = ServerError.badRequest(
				USER_ERROR_MESSAGES.INVALID_LOGIN
			);
			jest.spyOn(userService, "login").mockRejectedValue(error);

			const mockResponse = {
				cookie: jest.fn(),
			} as unknown as Response;

			await expect(
				userController.login(loginDto, mockResponse)
			).rejects.toThrow(error);
		});
	});

	describe("POST /user/logout", () => {
		it("로그아웃 성공 시 200 상태 코드와 성공 메시지를 반환한다", async () => {
			const mockRequest = {
				user: { userId: 1 },
			};

			const mockResponse = {
				clearCookie: jest.fn(),
			} as unknown as Response;

			jest.spyOn(loginGuard, "canActivate").mockReturnValue(true);
			jest.spyOn(userService, "logout").mockResolvedValue(undefined);

			const result = await userController.logout(
				mockRequest as any,
				mockResponse
			);

			expect(userService.logout).toHaveBeenCalledWith(1);
			expect(mockResponse.clearCookie).toHaveBeenCalledTimes(2);
			expect(mockResponse.clearCookie).toHaveBeenCalledWith(
				"accessToken"
			);
			expect(mockResponse.clearCookie).toHaveBeenCalledWith(
				"refreshToken"
			);
			expect(result).toEqual({ message: "로그아웃 성공" });
		});
	});
});
