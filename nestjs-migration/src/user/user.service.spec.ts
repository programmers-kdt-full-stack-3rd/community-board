import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ServerError } from "../common/exceptions/server-error.exception";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./user.entity";
import { UserService } from "./user.service";

describe("UserService", () => {
	let service: UserService;
	let repository: Repository<User>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UserService,
				{
					provide: getRepositoryToken(User),
					useValue: {
						save: jest.fn(),
					},
				},
			],
		}).compile();

		service = module.get<UserService>(UserService);
		repository = module.get<Repository<User>>(getRepositoryToken(User));
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
			expect(repository.save).toHaveBeenCalledWith(createUserDto);
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
