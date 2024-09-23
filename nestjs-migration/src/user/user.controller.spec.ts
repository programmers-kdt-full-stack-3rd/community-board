import { Test, TestingModule } from "@nestjs/testing";
import { Request, Response } from "express";
import { AuthService } from "../auth/auth.service";
import { ServerError } from "../common/exceptions/server-error.exception";
import { LoginGuard } from "../common/guard/login.guard";
import { PasswordGuard } from "../common/guard/password.guard";
import { IUserEntity } from "../common/interface/user-entity.interface";
import { OAuthConnection } from "../oauth/entities/oauth-connection.entity";
import { RbacService } from "../rbac/rbac.service";
import * as dateUtil from "../utils/date.util";
import { COOKIE_MAX_AGE, USER_ERROR_MESSAGES } from "./constant/user.constants";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

describe("UserController", () => {
	let userController: UserController;
	let userService: UserService;
	let loginGuard: LoginGuard;
	let rbacService: RbacService;

	const mockUserService = {
		login: jest.fn(),
		createUser: jest.fn(),
		logout: jest.fn(),
		checkPassword: jest.fn(),
		readUser: jest.fn(),
		updateUser: jest.fn(),
	};

	const mockRbacService = {
		isAdmin: jest.fn(),
	};

	const mockTime = "2024-01-01T00:00:00.000+09:00";

	const mockUserEntity: IUserEntity = {
		userId: 1,
		roleId: 2,
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UserController],
			providers: [
				LoginGuard,
				PasswordGuard,

				{
					provide: AuthService,
					useValue: {},
				},

				{
					provide: UserService,
					useValue: mockUserService,
				},
				{
					provide: RbacService,
					useValue: mockRbacService,
				},
			],
		}).compile();

		userController = module.get<UserController>(UserController);
		userService = module.get<UserService>(UserService);
		loginGuard = module.get<LoginGuard>(LoginGuard);
		rbacService = module.get<RbacService>(RbacService);

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
		checkGuardApplied("readUser");
		checkGuardApplied("updateUser");
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
				cookies: {
					refreshToken: "mock-refresh-token",
				},
			} as unknown as Request;

			const mockResponse = {
				clearCookie: jest.fn(),
			} as unknown as Response;

			jest.spyOn(loginGuard, "canActivate").mockReturnValue(true);
			jest.spyOn(userService, "logout").mockResolvedValue(undefined);

			const result = await userController.logout(
				mockRequest,
				mockUserEntity,
				mockResponse
			);

			expect(userService.logout).toHaveBeenCalledWith(
				1,
				"mock-refresh-token"
			);
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

	describe("POST /user/check-password", () => {
		it("비밀번호 확인 성공 시 200 상태 코드와 임시 토큰을 반환한다", async () => {
			const mockResponse = {
				cookie: jest.fn(),
			} as unknown as Response;

			const checkPasswordDto = {
				password: "password123",
			};

			const mockCheckResult = {
				tempToken: "mock-temp-token",
			};

			jest.spyOn(loginGuard, "canActivate").mockReturnValue(true);
			jest.spyOn(userService, "checkPassword").mockResolvedValue(
				mockCheckResult
			);

			const result = await userController.checkPassword(
				mockUserEntity,
				mockResponse,
				checkPasswordDto
			);

			expect(userService.checkPassword).toHaveBeenCalledWith(
				1,
				checkPasswordDto.password
			);
			expect(mockResponse.cookie).toHaveBeenCalledTimes(1);
			expect(mockResponse.cookie).toHaveBeenCalledWith(
				"tempToken",
				mockCheckResult.tempToken,
				{
					httpOnly: true,
					secure: true,
					maxAge: COOKIE_MAX_AGE.tempToken,
				}
			);
			expect(result).toEqual({ message: "비밀번호 확인 성공" });
		});

		it("비밀번호 확인 실패 시 예외를 던진다", async () => {
			const mockRequest = {
				user: { userId: 1 },
			};

			const mockResponse = {
				cookie: jest.fn(),
			} as unknown as Response;

			const checkPasswordDto = {
				password: "password123",
			};

			const error = ServerError.badRequest(
				USER_ERROR_MESSAGES.INVALID_PASSWORD
			);

			jest.spyOn(userService, "checkPassword").mockRejectedValue(error);

			await expect(
				userController.checkPassword(
					mockRequest as any,
					mockResponse,
					checkPasswordDto
				)
			).rejects.toThrow(error);
		});
	});

	describe("POST /user/check-admin", () => {
		beforeEach(() => {
			jest.clearAllMocks();
		});
		it("관리자 확인 성공 시 200 상태 코드와 성공 메시지를 반환한다", async () => {
			jest.spyOn(loginGuard, "canActivate").mockReturnValue(true);
			jest.spyOn(rbacService, "isAdmin").mockResolvedValue(true);

			const adminUserEntity = {
				...mockUserEntity,
				roleId: 1,
			};

			const result = await userController.checkIsAdmin(adminUserEntity);

			expect(rbacService.isAdmin).toHaveBeenCalledWith(1);
			expect(rbacService.isAdmin).toHaveBeenCalledTimes(1);
			expect(result).toEqual({ isAdmin: true });
		});

		it("관리자 확인 실패 시 200상태 코드와 실패 메시지를 반환한다", async () => {
			jest.spyOn(loginGuard, "canActivate").mockReturnValue(true);
			jest.spyOn(rbacService, "isAdmin").mockResolvedValue(false);

			const result = await userController.checkIsAdmin(mockUserEntity);

			expect(rbacService.isAdmin).toHaveBeenCalledWith(2);
			expect(rbacService.isAdmin).toHaveBeenCalledTimes(1);
			expect(result).toEqual({ isAdmin: false });
		});
	});

	describe("Get /user", () => {
		it("사용자 정보 조회 성공 시 200 상태 코드와 사용자 정보를 반환한다", async () => {
			const mockUser = {
				email: "test@test.com",
				nickname: "testuser",
			} as User;

			const mockOAuthConnections = [
				{
					oAuthProvider: {
						name: "google",
					},
				},
			] as OAuthConnection[];

			const mockResult = {
				user: mockUser,
				oAuthConnections: mockOAuthConnections,
			};

			jest.spyOn(loginGuard, "canActivate").mockReturnValue(true);
			jest.spyOn(userService, "readUser").mockResolvedValue(mockResult);

			const result = await userController.readUser(mockUserEntity);

			expect(userService.readUser).toHaveBeenCalledWith(1);
			expect(result).toEqual({
				email: mockUser.email,
				nickname: mockUser.nickname,
				connected_oauth: ["google"],
			});
		});
	});

	describe("PUT /user", () => {
		it("사용자 정보 수정 성공 시 200 상태 코드와 성공 메시지를 반환한다", async () => {
			const updateUserDto: UpdateUserDto = {
				password: "password123",
				nickname: "testuser",
			};

			jest.spyOn(loginGuard, "canActivate").mockReturnValue(true);
			jest.spyOn(userService, "updateUser").mockResolvedValue(true);

			const result = await userController.updateUser(
				mockUserEntity,
				updateUserDto
			);

			expect(userService.updateUser).toHaveBeenCalledWith(
				1,
				updateUserDto
			);

			expect(result).toEqual({ message: "회원정보 수정 성공" });
		});
	});
});
