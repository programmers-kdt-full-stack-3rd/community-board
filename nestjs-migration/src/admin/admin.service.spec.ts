import { Test, TestingModule } from "@nestjs/testing";
import { IUserInfoResponse } from "shared";
import { UserRepository } from "../user/user.repository";
import { UserService } from "../user/user.service";
import { AdminService } from "./admin.service";
import { GetUsersDto } from "./dto/get-users.dto";

describe("AdminService", () => {
	let adminService: AdminService;
	let userRepository: UserRepository;
	let userService: UserService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AdminService,
				{
					provide: UserRepository,
					useValue: {
						getUserInfo: jest.fn(),
					},
				},

				{
					provide: UserService,
					useValue: {
						deleteUser: jest.fn(),
					},
				},
			],
		}).compile();

		adminService = module.get<AdminService>(AdminService);
		userRepository = module.get<UserRepository>(UserRepository);
		userService = module.get<UserService>(UserService);
	});

	it("should be defined", () => {
		expect(adminService).toBeDefined();
	});

	describe("getUsers", () => {
		const mockGetUsersDto = new GetUsersDto();

		const mockResult: IUserInfoResponse = {
			userInfo: [
				{
					id: 1,
					email: "test@test.com",
					nickname: "testUser",
					createdAt: new Date("2024-01-01"),
					isDelete: false,
					statistics: {
						comments: 0,
						posts: 0,
					},
				},
			],
			total: 0,
		};
		it("유저 리스트를 가져온다.", async () => {
			jest.spyOn(userRepository, "getUserInfo").mockResolvedValue(
				mockResult
			);

			const result = await adminService.getUsers(mockGetUsersDto);

			expect(userRepository.getUserInfo).toHaveBeenCalledWith(
				mockGetUsersDto
			);
			expect(result).toEqual(mockResult);
		});

		it("유저 리스트를 가져온다. (index < 1)", async () => {
			mockGetUsersDto.index = 0;
			jest.spyOn(userRepository, "getUserInfo").mockResolvedValue(
				mockResult
			);

			const result = await adminService.getUsers(mockGetUsersDto);

			expect(userRepository.getUserInfo).toHaveBeenCalledWith(
				expect.objectContaining({
					index: 0,
				})
			);
			expect(result).toEqual(mockResult);
		});

		it("유저 리스트를 가져온다. (perPage < 0)", async () => {
			mockGetUsersDto.perPage = -1;
			jest.spyOn(userRepository, "getUserInfo").mockResolvedValue(
				mockResult
			);

			const result = await adminService.getUsers(mockGetUsersDto);

			expect(userRepository.getUserInfo).toHaveBeenCalledWith(
				expect.objectContaining({
					perPage: 10,
				})
			);

			expect(result).toEqual(mockResult);
		});
	});

	describe("deleteUser", () => {
		it("성공적으로 유저를 삭제한다.", async () => {
			const userId = 1;

			jest.spyOn(userService, "deleteUser").mockResolvedValue();

			await adminService.deleteUser(userId);

			expect(userService.deleteUser).toHaveBeenCalledWith(userId);
			expect(userService.deleteUser).toHaveBeenCalledTimes(1);
		});

		it("userService.deleteUser가 예외를 던지면 그 예외를 그대로 전파한다", async () => {
			const userId = 1;
			jest.spyOn(userService, "deleteUser").mockRejectedValue(
				new Error("deleteUser error")
			);

			await expect(adminService.deleteUser(userId)).rejects.toThrow(
				"deleteUser error"
			);
		});
	});
});
