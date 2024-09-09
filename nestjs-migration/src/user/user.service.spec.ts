import { Test, TestingModule } from "@nestjs/testing";
import { ServerError } from "../common/exceptions/server-error.exception";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";

describe("UserService", () => {
	let service: UserService;
	let repository: UserRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UserService,
				{
					provide: UserRepository,
					useValue: {
						save: jest.fn(),
					},
				},
			],
		}).compile();

		service = module.get<UserService>(UserService);
		repository = module.get<UserRepository>(UserRepository);
	});

	describe("createUser", () => {
		it("성공적으로 유저를 추가 했을때", async () => {
			const createUserDto: CreateUserDto = {
				nickname: "testuser",
				email: "test@example.com",
				password: "password123",
			};

			const mockUser = new User();
			Object.assign(mockUser, createUserDto);
			mockUser.id = 1;

			jest.spyOn(repository, "save").mockResolvedValue(mockUser);

			const result = await service.createUser(createUserDto);

			expect(result).toEqual(mockUser);
			expect(repository.save).toHaveBeenCalledWith(
				expect.objectContaining(createUserDto)
			);
		});

		it("db내부에서 모르는 에러가 발생시", async () => {
			const createUserDto: CreateUserDto = {
				nickname: "testuser",
				email: "test@example.com",
				password: "password123",
			};

			jest.spyOn(repository, "save").mockRejectedValue(
				new Error("Database error")
			);

			await expect(service.createUser(createUserDto)).rejects.toThrow(
				Error
			);
		});

		it("이미 가입한 이메일이 있을 경우", async () => {
			const createUserDto: CreateUserDto = {
				nickname: "testuser",
				email: "test@example.com",
				password: "password123",
			};

			const duplicateError: any = new Error("Duplicate entry");
			duplicateError.code = "ER_DUP_ENTRY";

			jest.spyOn(repository, "save").mockRejectedValue(duplicateError);

			await expect(service.createUser(createUserDto)).rejects.toThrow(
				ServerError
			);
			await expect(service.createUser(createUserDto)).rejects.toThrow(
				"이미 존재하는 이메일입니다."
			);
		});
	});
});
