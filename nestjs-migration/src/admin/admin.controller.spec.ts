import { Test, TestingModule } from "@nestjs/testing";
import { IAdminPostResponse, IUserInfoResponse } from "shared";
import { ServerError } from "../common/exceptions/server-error.exception";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { GetPostsDto } from "./dto/get-posts.dto";
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
						restoreUser: jest.fn(),
						getPosts: jest.fn(),
						deletePost: jest.fn(),
						restorePost: jest.fn(),
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
				index: 1,
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

	describe("PATCH /api/admin/users/:userId/restore", () => {
		it("성공적으로 유저를 복구한다.", async () => {
			const userId = 1;

			jest.spyOn(adminService, "restoreUser").mockResolvedValue();

			const result = await adminController.restoreUser(userId);

			expect(adminService.restoreUser).toHaveBeenCalledWith(userId);
			expect(result).toEqual({ message: "회원 복구 성공" });
		});

		it("유저 복구 실패", async () => {
			const userId = 1;

			jest.spyOn(adminService, "restoreUser").mockRejectedValue(
				ServerError.badRequest("회원 복구 실패")
			);

			const result = adminController.restoreUser(userId);

			await expect(result).rejects.toThrow(ServerError);
			await expect(result).rejects.toThrow("회원 복구 실패");
		});
	});

	describe("GET /api/admin/post", () => {
		const mockGetPostsDto = new GetPostsDto();

		it("게시글 리스트를 가져온다.", async () => {
			const mockResult: IAdminPostResponse = {
				total: 1,
				postHeaders: [
					{
						id: 1,
						title: "test",
						author: "testUser",
						createdAt: new Date("2024-01-01"),
						isDelete: false,
						isPrivate: false,
					},
				],
			};

			jest.spyOn(adminService, "getPosts").mockResolvedValue(mockResult);

			const result = await adminController.getPosts(mockGetPostsDto);

			expect(adminService.getPosts).toHaveBeenCalledWith(mockGetPostsDto);
			expect(result).toEqual(mockResult);
		});
	});

	describe("DELETE /api/admin/post/:postId", () => {
		it("성공적으로 게시글을 삭제한다.", async () => {
			const postId = 1;

			jest.spyOn(adminService, "deletePost").mockResolvedValue();

			const result = await adminController.deletePost(postId);

			expect(adminService.deletePost).toHaveBeenCalledWith(postId);
			expect(result).toEqual({ message: "게시글 삭제 성공" });
		});
	});

	describe("PATCH /api/admin/post/:postId/restore", () => {
		it("성공적으로 게시글을 복구한다.", async () => {
			const postId = 1;

			jest.spyOn(adminService, "restorePost").mockResolvedValue();

			const result = await adminController.restorePost(postId);

			expect(adminService.restorePost).toHaveBeenCalledWith(postId);
			expect(result).toEqual({ message: "게시글 복구 성공" });
		});
	});
});
