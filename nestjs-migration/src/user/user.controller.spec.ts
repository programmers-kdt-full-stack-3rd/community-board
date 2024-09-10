import { Test, TestingModule } from "@nestjs/testing";
import { ServerError } from "../common/exceptions/server-error.exception";
import { USER_ERROR_MESSAGES } from "./constant/user.constants";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

describe("UserController", () => {
	let userController: UserController;
	let userService: UserService;

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

		userController = module.get<UserController>(UserController);
		userService = module.get<UserService>(UserService);
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
});
