import { Test, TestingModule } from "@nestjs/testing";
import { IUserInfoResponse } from "shared";
import { UserRepository } from "../user/user.repository";
import { AdminService } from "./admin.service";
import { GetUsersDto } from "./dto/get-users.dto";

describe("AdminService", () => {
	let adminService: AdminService;
	let userRepository: UserRepository;

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
			],
		}).compile();

		adminService = module.get<AdminService>(AdminService);
		userRepository = module.get<UserRepository>(UserRepository);
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
});
