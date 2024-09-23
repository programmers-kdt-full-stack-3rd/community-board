import { Test, TestingModule } from "@nestjs/testing";
import { DeleteResult, UpdateResult } from "typeorm";
import { AuthService } from "../auth/auth.service";
import { RefreshTokensRepository } from "../auth/refresh-tokens.repository";
import { ServerError } from "../common/exceptions/server-error.exception";
import { OAuthService } from "../oauth/oauth.service";
import { OAuthTokenService } from "../oauth/oauthtoken.service";
import { OAuthConnectionRepository } from "../oauth/repositories/oauth-connection.repository";
import * as cryptoUtil from "../utils/crypto.util";
import { USER_ERROR_MESSAGES } from "./constant/user.constants";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";

describe("UserService", () => {
	let userService: UserService;
	let userRepository: UserRepository;
	let authService: AuthService;
	let refreshTokenRepository: RefreshTokensRepository;
	let oAuthConnectionRepository: OAuthConnectionRepository;

	const mockUserRepository = {
		save: jest.fn(),
		findOne: jest.fn(),
		updateUser: jest.fn(),
		registerUserEmail: jest.fn(),
	};

	const mockAuthService = {
		makeTempToken: jest.fn(),
		generateTokens: jest.fn(),
	};

	const mockRefreshTokensRepository = {
		save: jest.fn(),
		delete: jest.fn(),
	};

	const mockOAuthConnectionRepository = {
		getOAuthConnectionByUserId: jest.fn(),
	};

	const mockSalt = "mocksalt";
	const mockHashedPassword = "mockhpassword";
	const mockAccessToken = "mockAccessToken";
	const mockRefreshToken = "mockRefreshToken";
	const mockTempToken = "mockTempToken";
	const mockTokens = {
		accessToken: mockAccessToken,
		refreshToken: mockRefreshToken,
	};

	const createMockUser = (overrides: Partial<User> = {}): User => {
		const user = new User();
		return Object.assign(
			user,
			{
				id: 1,
				email: "test@example.com",
				password: mockHashedPassword,
				salt: mockSalt,
				nickname: "testuser",
			} as User,
			overrides
		);
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UserService,
				{
					provide: UserRepository,
					useValue: mockUserRepository,
				},
				{
					provide: AuthService,
					useValue: mockAuthService,
				},
				{
					provide: RefreshTokensRepository,
					useValue: mockRefreshTokensRepository,
				},
				{
					provide: OAuthConnectionRepository,
					useValue: mockOAuthConnectionRepository,
				},
				{
					provide: OAuthService,
					useValue: {},
				},
				{
					provide: OAuthTokenService,
					useValue: {},
				},
			],
		}).compile();

		userService = module.get<UserService>(UserService);
		userRepository = module.get<UserRepository>(UserRepository);
		authService = module.get<AuthService>(AuthService);
		refreshTokenRepository = module.get<RefreshTokensRepository>(
			RefreshTokensRepository
		);

		jest.spyOn(cryptoUtil, "makeSalt").mockResolvedValue(mockSalt);
		jest.spyOn(cryptoUtil, "makeHashedPassword").mockResolvedValue(
			mockHashedPassword
		);

		jest.spyOn(authService, "makeTempToken").mockReturnValue(mockTempToken);
		jest.spyOn(authService, "generateTokens").mockReturnValue(mockTokens);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("createUser", () => {
		// 공통으로 사용할 CreateUserDto 객체
		const createUserDto: CreateUserDto = {
			email: "test@example.com",
			password: "password123",
			nickname: "testuser",
		};

		it("사용자를 성공적으로 생성한다", async () => {
			const mockData = createMockUser();

			jest.spyOn(userRepository, "save").mockResolvedValue(mockData);
			const result = await userService.createUser(createUserDto);

			expect(result).toEqual(expect.objectContaining(mockData));
		});

		it("탈퇴한 이메일로 가입 시도시 ServerError를 발생시킨다", async () => {
			const mockData = createMockUser({ isDelete: true });

			jest.spyOn(userRepository, "save").mockRejectedValue({
				code: "ER_DUP_ENTRY",
				sqlMessage: "Duplicate entry for key email",
			});
			jest.spyOn(userRepository, "findOne").mockResolvedValue(mockData);

			await expect(userService.createUser(createUserDto)).rejects.toThrow(
				ServerError
			);
			await expect(userService.createUser(createUserDto)).rejects.toThrow(
				USER_ERROR_MESSAGES.DELETED_EMAIL
			);
		});

		it("이미 존재하는 이메일로 가입 시도 시 ServerError를 발생시킨다", async () => {
			const mockData = createMockUser();

			jest.spyOn(userRepository, "save").mockRejectedValue({
				code: "ER_DUP_ENTRY",
				sqlMessage: "Duplicate entry for key email",
			});
			jest.spyOn(userRepository, "findOne").mockResolvedValue(mockData);

			await expect(userService.createUser(createUserDto)).rejects.toThrow(
				ServerError
			);
			await expect(userService.createUser(createUserDto)).rejects.toThrow(
				USER_ERROR_MESSAGES.DUPLICATE_EMAIL
			);
		});

		it("이미 사용 중인 닉네임으로 가입 시도 시 ServerError를 발생시킨다", async () => {
			const createUserDto: CreateUserDto = {
				email: "new@example.com",
				password: "password123",
				nickname: "existingnick",
			};
			jest.spyOn(userRepository, "save").mockRejectedValue({
				code: "ER_DUP_ENTRY",
				sqlMessage: "Duplicate entry for key nickname",
			});

			await expect(userService.createUser(createUserDto)).rejects.toThrow(
				ServerError
			);
			await expect(userService.createUser(createUserDto)).rejects.toThrow(
				USER_ERROR_MESSAGES.DUPLICATE_NICKNAME
			);
		});
	});

	describe("login", () => {
		const loginDto = {
			email: "new@example.com",
			password: "password123",
		};

		it("사용자가 성공적으로 로그인한다.", async () => {
			const mockUser = createMockUser();

			jest.spyOn(userRepository, "findOne").mockResolvedValue(mockUser);

			const result = await userService.login(loginDto);

			expect(result).toEqual({
				nickname: mockUser.nickname,
				...mockTokens,
			});
		});

		it("로그인 성공 시 리프레시 토큰을 저장한다", async () => {
			const mockUser = createMockUser();
			jest.spyOn(userRepository, "findOne").mockResolvedValue(mockUser);
			jest.spyOn(refreshTokenRepository, "save").mockResolvedValue(
				{} as any
			);

			await userService.login(loginDto);

			expect(refreshTokenRepository.save).toHaveBeenCalledWith(
				expect.objectContaining({
					userId: mockUser.id,
					token: expect.any(String),
					expiredAt: expect.any(Date),
				})
			);
		});

		it("존재하지 않는 사용자가 로그인 시도 시 ServerError를 발생시킨다", async () => {
			jest.spyOn(userRepository, "findOne").mockResolvedValue(undefined);

			await expect(userService.login(loginDto)).rejects.toThrow(
				ServerError
			);
			await expect(userService.login(loginDto)).rejects.toThrow(
				USER_ERROR_MESSAGES.NOT_FOUND_EMAIL
			);
		});

		it("탈퇴한 사용자가 로그인 시도 시 ServerError를 발생시킨다", async () => {
			const mockUser = createMockUser({ isDelete: true });

			jest.spyOn(userRepository, "findOne").mockResolvedValue(mockUser);

			await expect(userService.login(loginDto)).rejects.toThrow(
				ServerError
			);
			await expect(userService.login(loginDto)).rejects.toThrow(
				USER_ERROR_MESSAGES.DELETED_USER
			);
		});

		it("비밀번호가 일치하지 않을 때 ServerError를 발생시킨다", async () => {
			const mockUser = createMockUser();

			jest.spyOn(userRepository, "findOne").mockResolvedValue(mockUser);
			jest.spyOn(cryptoUtil, "makeHashedPassword").mockResolvedValue(
				"wrongpassword"
			);

			await expect(userService.login(loginDto)).rejects.toThrow(
				ServerError
			);
			await expect(userService.login(loginDto)).rejects.toThrow(
				USER_ERROR_MESSAGES.INVALID_LOGIN
			);
		});
	});

	describe("logout", () => {
		it("로그아웃 성공 시 refreshToken을 삭제해야한다.", async () => {
			const userId = 1;

			jest.spyOn(refreshTokenRepository, "delete").mockResolvedValue({
				affected: 1,
			} as DeleteResult);

			await userService.logout(userId, mockRefreshToken);

			expect(refreshTokenRepository.delete).toHaveBeenCalledWith({
				userId,
				token: mockRefreshToken,
			});
		});

		it("유효한 사용자이지만 리프레시 토큰이 없는 경우 ServerError를 발생시킨다", async () => {
			const userId = 1;

			jest.spyOn(refreshTokenRepository, "delete").mockResolvedValue({
				affected: 0,
			} as DeleteResult);

			const result = userService.logout(userId, mockRefreshToken);

			await expect(result).rejects.toThrow(ServerError);
			await expect(result).rejects.toThrow(
				USER_ERROR_MESSAGES.FAILED_TOKEN_DELETE
			);
		});
	});

	describe("checkPassword", () => {
		const userId = 1;
		const password = "password123";
		const mockUser = createMockUser();
		it("비밀번호 확인 성공 시 tempToken을 반환한다", async () => {
			jest.spyOn(userRepository, "findOne").mockResolvedValue(mockUser);

			const result = await userService.checkPassword(userId, password);

			expect(result).toEqual({ tempToken: mockTempToken });
		});

		it("비밀번호가 일치하지 않을 때 ServerError를 발생시킨다", async () => {
			jest.spyOn(userRepository, "findOne").mockResolvedValue(mockUser);
			jest.spyOn(cryptoUtil, "makeHashedPassword").mockResolvedValue(
				"wrongpassword"
			);

			const result = userService.checkPassword(userId, password);

			await expect(result).rejects.toThrow(ServerError);
			await expect(result).rejects.toThrow(
				USER_ERROR_MESSAGES.INVALID_PASSWORD
			);
		});

		it("존재하지 않는 사용자가 비밀번호 확인 시도 시 ServerError를 발생시킨다", async () => {
			jest.spyOn(userRepository, "findOne").mockResolvedValue(undefined);

			const result = userService.checkPassword(userId, password);

			await expect(result).rejects.toThrow(ServerError);
			await expect(result).rejects.toThrow(
				USER_ERROR_MESSAGES.NOT_FOUND_USER
			);
		});
	});

	describe("readUser", () => {
		const mockUser = createMockUser();
		const mockOAuthConnections = [{ oAuthProvider: { name: "google" } }];

		beforeEach(() => {
			jest.spyOn(userRepository, "findOne").mockResolvedValue(mockUser);

			jest.spyOn(
				mockOAuthConnectionRepository,
				"getOAuthConnectionByUserId"
			).mockResolvedValue([
				{
					oAuthProvider: { name: "google" },
				},
			]);
		});

		describe("성공 케이스", () => {
			it("사용자 정보를 반환한다", async () => {
				const userId = 1;

				const result = await userService.readUser(userId);

				expect(userRepository.findOne).toHaveBeenCalledWith({
					where: { id: userId, isDelete: false },
				});
				expect(
					mockOAuthConnectionRepository.getOAuthConnectionByUserId
				).toHaveBeenCalledWith(userId);

				expect(result).toEqual({
					user: mockUser,
					oAuthConnections: mockOAuthConnections,
				});
			});
		});
	});

	describe("updateUser", () => {
		const mockUser = createMockUser();

		const newNickname = "newnickname";

		const oldPassword = "oldpassword";
		const newPassword = "newpassword";

		const mockOldHashedPassword = mockHashedPassword;
		const mockNewHashedPassword = "mockNewHashedPassword";

		const newEmail = "test@email.com";

		beforeEach(() => {
			jest.spyOn(userRepository, "findOne").mockResolvedValue(mockUser);
			jest.spyOn(cryptoUtil, "makeHashedPassword").mockImplementation(
				(password, salt) => {
					if (password === oldPassword) {
						return Promise.resolve(mockOldHashedPassword);
					}
					if (password === newPassword) {
						return Promise.resolve(mockNewHashedPassword);
					}
				}
			);

			jest.spyOn(userRepository, "updateUser").mockResolvedValue({
				affected: 1,
			} as UpdateResult);

			jest.spyOn(userRepository, "registerUserEmail").mockResolvedValue({
				affected: 1,
			} as UpdateResult);
		});

		describe("성공 케이스", () => {
			it("유저정보에 email이 있을때 유저 정보를 업데이트 한다.", async () => {
				const userId = 1;
				const updateUserDto = {
					nickname: newNickname,
					password: newPassword,
				};

				const mockUpdateData = {
					email: undefined,
					password: mockNewHashedPassword,
					nickname: newNickname,
					salt: mockSalt,
				};

				const result = await userService.updateUser(
					userId,
					updateUserDto
				);

				expect(cryptoUtil.makeHashedPassword).toHaveBeenCalledTimes(2);

				expect(cryptoUtil.makeHashedPassword).toHaveBeenCalledWith(
					newPassword,
					mockSalt
				);

				expect(userRepository.findOne).toHaveBeenCalledWith({
					where: { id: userId, isDelete: false },
				});

				expect(userRepository.updateUser).toHaveBeenCalledWith(
					userId,
					mockUpdateData
				);

				expect(result).toEqual(true);
			});

			it("유저정보에 email이 없을때 email,password,salt를 등록한다.", async () => {
				const userId = 1;
				const updateUserDto = {
					email: newEmail,
					nickname: newNickname,
					password: newPassword,
				};

				const mockUser = createMockUser({ email: null });

				jest.spyOn(userRepository, "findOne").mockResolvedValue(
					mockUser
				);

				const mockUpdateData = {
					email: newEmail,
					password: mockNewHashedPassword,
					nickname: newNickname,
					salt: mockSalt,
				};

				const result = await userService.updateUser(
					userId,
					updateUserDto
				);

				expect(cryptoUtil.makeHashedPassword).toHaveBeenCalledTimes(1);

				expect(cryptoUtil.makeHashedPassword).toHaveBeenCalledWith(
					newPassword,
					mockSalt
				);

				expect(userRepository.findOne).toHaveBeenCalledWith({
					where: { id: userId, isDelete: false },
				});

				expect(userRepository.registerUserEmail).toHaveBeenCalledWith(
					userId,
					mockUpdateData
				);

				expect(result).toEqual(true);
			});
		});

		describe("실패 케이스", () => {
			describe("updateUser 실패 케이스", () => {
				it("email이 존재하는 사용자가 dto에 email을 포함 하고 있을때 ServerError를 발생시킨다", async () => {
					const userId = 1;
					const updateUserDto = {
						email: newEmail,
						nickname: newNickname,
						password: newPassword,
					};

					const result = userService.updateUser(
						userId,
						updateUserDto
					);

					await expect(result).rejects.toThrow(ServerError);
					await expect(result).rejects.toThrow(
						USER_ERROR_MESSAGES.CANNOT_CHANGE_EMAIL
					);
				});
				it("email이 존재하지 않은 사용자가 dto에 email을 포함 하고 있지 않을때 ServerError를 발생시킨다", async () => {
					const userId = 1;
					const updateUserDto = {
						nickname: newNickname,
						password: newPassword,
					};

					const mockUser = createMockUser({ email: null });

					jest.spyOn(userRepository, "findOne").mockResolvedValue(
						mockUser
					);

					const result = userService.updateUser(
						userId,
						updateUserDto
					);

					await expect(result).rejects.toThrow(ServerError);
					await expect(result).rejects.toThrow(
						USER_ERROR_MESSAGES.SOCIAL_USER_NEED_EMAIL
					);
				});

				it("기존 비밀번호와 새 비밀번호가 같을 때 ServerError를 발생시킨다", async () => {
					const userId = 1;
					const updateUserDto = {
						nickname: newNickname,
						password: oldPassword,
					};

					const result = userService.updateUser(
						userId,
						updateUserDto
					);

					await expect(result).rejects.toThrow(ServerError);
					await expect(result).rejects.toThrow(
						USER_ERROR_MESSAGES.SAME_PASSWORD
					);
				});

				it("update 실패 시 ServerError를 발생시킨다", async () => {
					jest.spyOn(userRepository, "updateUser").mockResolvedValue({
						affected: 0,
					} as UpdateResult);

					const userId = 1;
					const updateUserDto = {
						nickname: newNickname,
						password: newPassword,
					};

					const result = userService.updateUser(
						userId,
						updateUserDto
					);

					await expect(result).rejects.toThrow(ServerError);
					await expect(result).rejects.toThrow(
						USER_ERROR_MESSAGES.UPDATE_USER_ERROR
					);
				});
			});

			describe("resisterUserEmail 실패케이스", () => {
				beforeEach(() => {
					jest.spyOn(userRepository, "findOne").mockResolvedValue(
						createMockUser({ email: null })
					);
				});

				it("registerUserEmail 실패 시 ServerError를 발생시킨다", async () => {
					jest.spyOn(
						userRepository,
						"registerUserEmail"
					).mockResolvedValue({
						affected: 0,
					} as UpdateResult);

					const userId = 1;
					const updateUserDto = {
						email: newEmail,
						nickname: newNickname,
						password: newPassword,
					};

					const result = userService.updateUser(
						userId,
						updateUserDto
					);

					await expect(result).rejects.toThrow(ServerError);
					await expect(result).rejects.toThrow(
						USER_ERROR_MESSAGES.UPDATE_RESISTER_USER_EMAIL
					);
				});

				it("error.code가 USER_ERROR_CODES.DUPLICATE_ENTRY일 때 ServerError를 발생시킨다", async () => {
					jest.spyOn(
						userRepository,
						"registerUserEmail"
					).mockRejectedValue({
						code: "ER_DUP_ENTRY",
						sqlMessage: "Duplicate entry for key email",
					});

					const userId = 1;
					const updateUserDto = {
						email: newEmail,
						nickname: newNickname,
						password: newPassword,
					};

					const result = userService.updateUser(
						userId,
						updateUserDto
					);

					await expect(result).rejects.toThrow(ServerError);
					await expect(result).rejects.toThrow(
						USER_ERROR_MESSAGES.DUPLICATE_EMAIL
					);
				});
			});
		});
	});
});
