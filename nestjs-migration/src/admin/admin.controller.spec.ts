import { Test, TestingModule } from "@nestjs/testing";
import { IUserInfoResponse } from "shared";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { GetUsersDto } from "./dto/get-users.dto";

describe("AdminController", () => {
	let adminController: AdminController;
	let adminService: AdminService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AdminController],
			providers: [
				{
					provide: AdminService,
					useValue: {
						getUsers: jest.fn(),
						deleteUser: jest.fn(),
					},
				},
			],
		}).compile();

		adminController = module.get<AdminController>(AdminController);
		adminService = module.get<AdminService>(AdminService);
	});

	it("should be defined", () => {
		expect(adminController).toBeDefined();
	});

	describe("GET /api/admin/users", () => {
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
			jest.spyOn(adminService, "getUsers").mockResolvedValue(mockResult);

			const result = await adminController.getUsers(mockGetUsersDto);

			expect(adminService.getUsers).toHaveBeenCalledWith({
				index: 0,
				perPage: 10,
			});
			expect(result).toEqual(mockResult);
		});
	});

	describe("DELETE /api/admin/users/:userId", () => {
		it("성공적으로 유저를 삭제한다.", async () => {
			const userId = 1;

			jest.spyOn(adminService, "deleteUser").mockResolvedValue();

			const result = await adminController.deleteUser(userId);

			expect(adminService.deleteUser).toHaveBeenCalledWith(userId);
			expect(result).toEqual({ message: "회원 삭제 성공" });
		});
	});
});
