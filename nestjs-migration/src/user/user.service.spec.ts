import { Test, TestingModule } from "@nestjs/testing";
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

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UserService,
				{
					provide: UserRepository,
					useValue: {
						save: jest.fn(),
						findOne: jest.fn(),
					},
				},
			],
		}).compile();

		userService = module.get<UserService>(UserService);
		userRepository = module.get<UserRepository>(UserRepository);
	});

	describe("createUser", () => {
		// 공통으로 사용할 CreateUserDto 객체
		const createUserDto: CreateUserDto = {
			email: "test@example.com",
			password: "password123",
			nickname: "testuser",
		};

		const mockSalt = "mocksalt";
		const mockHashedPassword = "mockhpassword";

		jest.spyOn(cryptoUtil, "makeSalt").mockResolvedValue(mockSalt);
		jest.spyOn(cryptoUtil, "makeHashedPassword").mockResolvedValue(
			mockHashedPassword
		);

		// 모의 데이터 생성 함수
		const createMockData = (overrides = {}): User => {
			const user = new User();

			Object.assign(
				user,
				{
					id: 1,
					email: createUserDto.email,
					password: mockSalt,
					salt: mockHashedPassword,
				} as User,
				overrides
			);

			return user;
		};

		it("사용자를 성공적으로 생성한다", async () => {
			const mockData = createMockData();

			jest.spyOn(userRepository, "save").mockResolvedValue(mockData);
			const result = await userService.createUser(createUserDto);

			expect(result).toEqual(expect.objectContaining(mockData));
		});

		it("탈퇴한 이메일로 가입 시도시 ServerError를 발생시킨다", async () => {
			const mockData = createMockData({ isDelete: true });

			jest.spyOn(userRepository, "save").mockRejectedValue({
				code: "ER_DUP_ENTRY",
				sqlMessage: "Duplicate entry for key email",
			});
			jest.spyOn(userRepository, "findOne").mockResolvedValue(mockData);

			await expect(userService.createUser(createUserDto)).rejects.toThrow(
				ServerError
			);
			await expect(userService.createUser(createUserDto)).rejects.toThrow(
				USER_ERROR_MESSAGES.DELETED_USER
			);
		});

		it("이미 존재하는 이메일로 가입 시도 시 ServerError를 발생시킨다", async () => {
			const mockData = createMockData();

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
});
