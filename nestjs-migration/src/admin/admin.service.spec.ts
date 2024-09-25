import { Test, TestingModule } from "@nestjs/testing";
import { IAdminPostResponse, IUserInfoResponse } from "shared";
import { UpdateResult } from "typeorm";
import { ServerError } from "../common/exceptions/server-error.exception";
import { PostRepository } from "../post/post.repository";
import { UserRepository } from "../user/user.repository";
import { UserService } from "../user/user.service";
import { AdminService } from "./admin.service";
import { GetPostsDto } from "./dto/get-posts.dto";
import { GetUsersDto } from "./dto/get-users.dto";

describe("AdminService", () => {
	let adminService: AdminService;
	let userRepository: UserRepository;
	let userService: UserService;
	let postRepository: PostRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AdminService,
				{
					provide: UserRepository,
					useValue: {
						getUserInfo: jest.fn(),
						restoreUser: jest.fn(),
					},
				},

				{
					provide: UserService,
					useValue: {
						deleteUser: jest.fn(),
					},
				},
				{
					provide: PostRepository,
					useValue: {
						getAdminPosts: jest.fn(),
					},
				},
			],
		}).compile();

		adminService = module.get<AdminService>(AdminService);
		userRepository = module.get<UserRepository>(UserRepository);
		userService = module.get<UserService>(UserService);
		postRepository = module.get<PostRepository>(PostRepository);
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

			expect(userRepository.getUserInfo).toHaveBeenCalledWith({
				index: 0,
				perPage: 10,
			});
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

	describe("restoreUser", () => {
		it("성공적으로 유저를 복구한다.", async () => {
			const userId = 1;
			jest.spyOn(userRepository, "restoreUser").mockResolvedValue({
				affected: 1,
			} as UpdateResult);

			await adminService.restoreUser(userId);

			expect(userRepository.restoreUser).toHaveBeenCalledWith(userId);
			expect(userRepository.restoreUser).toHaveBeenCalledTimes(1);
		});

		it("유저 복구 실패 시 예외를 던진다.", async () => {
			const userId = 1;
			jest.spyOn(userRepository, "restoreUser").mockResolvedValue({
				affected: 0,
			} as UpdateResult);

			const result = adminService.restoreUser(userId);

			await expect(result).rejects.toThrow(ServerError);
			await expect(result).rejects.toThrow("회원 복구 실패");
		});
	});

	describe("getPosts", () => {
		const mockGetPostsDto = new GetPostsDto();
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

		describe("성공 케이스", () => {
			it("게시글 리스트를 가져온다.", async () => {
				jest.spyOn(postRepository, "getAdminPosts").mockResolvedValue(
					mockResult
				);

				const result = await adminService.getPosts(mockGetPostsDto);

				expect(postRepository.getAdminPosts).toHaveBeenCalledWith(
					mockGetPostsDto
				);
				expect(result).toEqual(mockResult);
			});

			it("게시글 리스트를 가져온다. (index < 1)", async () => {
				mockGetPostsDto.index = 0;

				jest.spyOn(postRepository, "getAdminPosts").mockResolvedValue(
					mockResult
				);

				const result = await adminService.getPosts(mockGetPostsDto);

				expect(postRepository.getAdminPosts).toHaveBeenCalledWith(
					expect.objectContaining({
						index: 0,
					})
				);

				expect(result).toEqual(mockResult);
			});

			it("게시글 리스트를 가져온다. (perPage < 0)", async () => {
				mockGetPostsDto.perPage = -1;

				jest.spyOn(postRepository, "getAdminPosts").mockResolvedValue(
					mockResult
				);

				const result = await adminService.getPosts(mockGetPostsDto);

				expect(postRepository.getAdminPosts).toHaveBeenCalledWith(
					expect.objectContaining({
						perPage: 10,
					})
				);

				expect(result).toEqual(mockResult);
			});
		});

		describe("실패 케이스", () => {
			it("게시글이 존재하지 않는 경우", async () => {
				jest.spyOn(postRepository, "getAdminPosts").mockResolvedValue({
					total: 0,
					postHeaders: [],
				});

				const result = adminService.getPosts(mockGetPostsDto);

				await expect(result).rejects.toThrow(ServerError);
				await expect(result).rejects.toThrow(
					"게시글이 존재하지 않습니다."
				);
			});
		});
	});
});
