import { Test, TestingModule } from "@nestjs/testing";
import { ServerError } from "../common/exceptions/server-error.exception";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserController } from "./user.controller";
import { User } from "./user.entity";
import { UserService } from "./user.service";

describe("UserController", () => {
	let controller: UserController;
	let service: UserService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UserController],
			providers: [
				{
					provide: UserService,
					useValue: {
						createUser: jest.fn(),
					},
				},
			],
		}).compile();

		controller = module.get<UserController>(UserController);
		service = module.get<UserService>(UserService);
	});

	describe("joinUser", () => {
		it("should return 201 status code and success message when user is created", async () => {
			const createUserDto: CreateUserDto = {
				nickname: "testuser",
				email: "test@example.com",
				password: "password123",
			};

			const mockUser = new User();
			Object.assign(mockUser, createUserDto);
			mockUser.id = 1;

			jest.spyOn(service, "createUser").mockResolvedValue(mockUser);

			const result = await controller.joinUser(createUserDto);

			expect(result).toEqual({ message: "회원가입 성공" });
			expect(service.createUser).toHaveBeenCalledWith(createUserDto);
		});

		it("should throw an exception when service throws an error", async () => {
			const createUserDto: CreateUserDto = {
				nickname: "testuser",
				email: "test@example.com",
				password: "password123",
			};

			jest.spyOn(service, "createUser").mockRejectedValue(
				ServerError.badRequest("이미 존재하는 이메일입니다.")
			);

			await expect(controller.joinUser(createUserDto)).rejects.toThrow(
				ServerError
			);
			await expect(controller.joinUser(createUserDto)).rejects.toThrow(
				"이미 존재하는 이메일입니다."
			);
		});
	});
});
