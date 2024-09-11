import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "../auth/auth.service";
import { RefreshTokensRepository } from "../auth/refresh-tokens.repository";
import { ServerError } from "../common/exceptions/server-error.exception";
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

	const mockUserRepository = {
		save: jest.fn(),
		findOne: jest.fn(),
	};

	const mockAuthService = {
		generateTokens: jest.fn(),
	};

	const mockRefreshTokensRepository = {
		save: jest.fn(),
	};

	const mockSalt = "mocksalt";
	const mockHashedPassword = "mockhpassword";
	const mockTokens = {
		accessToken: "mockAccessToken",
		refreshToken: "mockRefreshToken",
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
		jest.spyOn(authService, "generateTokens").mockReturnValue(mockTokens);
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
});