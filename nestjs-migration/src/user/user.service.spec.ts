import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { UserRepository } from "./user.repository";
import { CreateUserDto } from "./dto/create-user.dto";
import { ServerError } from "../common/exceptions/server-error.exception";
import { ResultSetHeader } from "mysql2/promise";

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
						createUser: jest.fn(),
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

			const mockResult = {
				insertId: 1,
				affectedRows: 1,
			} as ResultSetHeader;

			jest.spyOn(repository, "createUser").mockResolvedValue(mockResult);

			await expect(
				service.createUser(createUserDto)
			).resolves.not.toThrow();

			expect(repository.createUser).toHaveBeenCalledWith(
				expect.objectContaining({
					nickname: "testuser",
					email: "test@example.com",
					password: "password123",
				})
			);
		});

		it("db내부에서 모르는 에러가 발생시", async () => {
			const createUserDto: CreateUserDto = {
				nickname: "testuser",
				email: "test@example.com",
				password: "password123",
			};

			jest.spyOn(repository, "createUser").mockRejectedValue(
				new Error("Database error")
			);

			await expect(service.createUser(createUserDto)).rejects.toThrow(
				Error
			);
		});

		it("db에 insert한 데이터가 없는 경우", async () => {
			const createUserDto: CreateUserDto = {
				nickname: "testuser",
				email: "test@example.com",
				password: "password123",
			};

			const mockResult = {
				insertId: 0,
				affectedRows: 0,
			} as ResultSetHeader;

			jest.spyOn(repository, "createUser").mockResolvedValue(mockResult);

			await expect(service.createUser(createUserDto)).rejects.toThrow(
				ServerError
			);
			await expect(service.createUser(createUserDto)).rejects.toThrow(
				"회원가입 실패"
			);
		});

		it("이미 가입한 이메일이 있을 경우", async () => {
			const createUserDto: CreateUserDto = {
				nickname: "testuser",
				email: "test@example.com",
				password: "password123",
			};

			jest.spyOn(repository, "createUser").mockRejectedValue({
				code: "ER_DUP_ENTRY",
			});

			await expect(service.createUser(createUserDto)).rejects.toThrow(
				ServerError
			);
			await expect(service.createUser(createUserDto)).rejects.toThrow(
				"이미 존재하는 이메일입니다."
			);
		});
	});
});
