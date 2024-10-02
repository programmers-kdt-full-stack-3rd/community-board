import { Test, TestingModule } from "@nestjs/testing";
import {
	IAdminPostResponse,
	IUserInfoResponse,
	TInterval,
	mapStatsToResponse,
} from "shared";
import { UpdateResult } from "typeorm";
import { CommentRepository } from "../comment/comment.repository";
import { ServerError } from "../common/exceptions/server-error.exception";
import { PostRepository } from "../post/post.repository";
import { User } from "../user/entities/user.entity";
import { UserRepository } from "../user/user.repository";
import { UserService } from "../user/user.service";
import { AdminService } from "./admin.service";
import { GetPostsDto } from "./dto/get-posts.dto";
import { GetStatsQueryDto } from "./dto/get-stats.dto";
import { GetUsersDto } from "./dto/get-users.dto";

jest.mock("shared", () => ({
	...jest.requireActual("shared"),
	mapStatsToResponse: jest.fn(),
}));

describe("AdminService", () => {
	let adminService: AdminService;
	let userRepository: UserRepository;
	let userService: UserService;
	let postRepository: PostRepository;
	let commentRepository: CommentRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AdminService,
				{
					provide: UserService,
					useValue: {
						deleteUser: jest.fn(),
					},
				},
				{
					provide: UserRepository,
					useValue: {
						getUserInfo: jest.fn(),
						restoreUser: jest.fn(),
						countActiveUsers: jest.fn(),
						getIntervalStats: jest.fn(),
						findOne: jest.fn(),
					},
				},
				{
					provide: PostRepository,
					useValue: {
						getAdminPosts: jest.fn(),
						update: jest.fn(),
						getPostStats: jest.fn(),
						getIntervalStats: jest.fn(),
						getPostStatByUser: jest.fn(),
					},
				},
				{
					provide: CommentRepository,
					useValue: {
						countActiveComments: jest.fn(),
						getIntervalStats: jest.fn(),
						getCommentStatByUser: jest.fn(),
					},
				},
			],
		}).compile();

		adminService = module.get<AdminService>(AdminService);
		userRepository = module.get<UserRepository>(UserRepository);
		userService = module.get<UserService>(UserService);
		postRepository = module.get<PostRepository>(PostRepository);
		commentRepository = module.get<CommentRepository>(CommentRepository);
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

	describe("deletePost", () => {
		it("성공적으로 게시글을 삭제한다.", async () => {
			const postId = 1;

			jest.spyOn(postRepository, "update").mockResolvedValue({
				affected: 1,
			} as UpdateResult);

			await adminService.deletePost(postId);

			expect(postRepository.update).toHaveBeenCalledWith(
				{ id: postId, isDelete: false },
				{ isDelete: true }
			);
			expect(postRepository.update).toHaveBeenCalledTimes(1);
		});

		it("게시글 삭제 실패 시 예외를 던진다.", async () => {
			const postId = 1;

			jest.spyOn(postRepository, "update").mockResolvedValue({
				affected: 0,
			} as UpdateResult);

			const result = adminService.deletePost(postId);

			await expect(result).rejects.toThrow(ServerError);
			await expect(result).rejects.toThrow("게시글 삭제 실패");
		});
	});

	describe("restorePost", () => {
		it("성공적으로 게시글을 복구한다.", async () => {
			const postId = 1;

			jest.spyOn(postRepository, "update").mockResolvedValue({
				affected: 1,
			} as UpdateResult);

			await adminService.restorePost(postId);

			expect(postRepository.update).toHaveBeenCalledWith(
				{ id: postId, isDelete: true },
				{ isDelete: false }
			);
			expect(postRepository.update).toHaveBeenCalledTimes(1);
		});

		it("게시글 복구 실패 시 예외를 던진다.", async () => {
			const postId = 1;

			jest.spyOn(postRepository, "update").mockResolvedValue({
				affected: 0,
			} as UpdateResult);

			const result = adminService.restorePost(postId);

			await expect(result).rejects.toThrow(ServerError);
			await expect(result).rejects.toThrow("게시글 복구 실패");
		});
	});

	describe("publicPost", () => {
		it("성공적으로 게시글을 공개한다.", async () => {
			const postId = 1;

			jest.spyOn(postRepository, "update").mockResolvedValue({
				affected: 1,
			} as UpdateResult);

			await adminService.publicPost(postId);

			expect(postRepository.update).toHaveBeenCalledWith(
				{ id: postId, isPrivate: true },
				{ isPrivate: false }
			);
			expect(postRepository.update).toHaveBeenCalledTimes(1);
		});

		it("게시글 공개 실패 시 예외를 던진다.", async () => {
			const postId = 1;

			jest.spyOn(postRepository, "update").mockResolvedValue({
				affected: 0,
			} as UpdateResult);

			const result = adminService.publicPost(postId);

			await expect(result).rejects.toThrow(ServerError);
			await expect(result).rejects.toThrow("게시글 공개 실패");
		});
	});

	describe("privatePost", () => {
		it("성공적으로 게시글을 비공개한다.", async () => {
			const postId = 1;

			jest.spyOn(postRepository, "update").mockResolvedValue({
				affected: 1,
			} as UpdateResult);

			await adminService.privatePost(postId);

			expect(postRepository.update).toHaveBeenCalledWith(
				{ id: postId, isPrivate: false },
				{ isPrivate: true }
			);
			expect(postRepository.update).toHaveBeenCalledTimes(1);
		});

		it("게시글 비공개 실패 시 예외를 던진다.", async () => {
			const postId = 1;

			jest.spyOn(postRepository, "update").mockResolvedValue({
				affected: 0,
			} as UpdateResult);

			const result = adminService.privatePost(postId);

			await expect(result).rejects.toThrow(ServerError);
			await expect(result).rejects.toThrow("게시글 비공개 실패");
		});
	});

	describe("getStats", () => {
		const mockGetStatsQueryDto = new GetStatsQueryDto();
		const mockTotalStats = {
			posts: 1,
			comments: 1,
			views: 1,
			users: 1,
		};

		const mockIntervalStats = {
			posts: [{ date: "2024-01-01", count: 1, views: 1 }],
			comments: [{ date: "2024-01-01", count: 1 }],
			users: [{ date: "2024-01-01", count: 1 }],
		};

		const mockResponse = {
			totalStats: mockTotalStats,
			intervalStats: [
				{
					date: mockIntervalStats.posts[0].date,
					posts: mockIntervalStats.posts[0].count,
					comments: mockIntervalStats.comments[0].count,
					views: mockIntervalStats.posts[0].views,
					users: mockIntervalStats.users[0].count,
				},
			],
		};
		beforeEach(() => {
			jest.spyOn(postRepository, "getPostStats").mockResolvedValue({
				count: mockTotalStats.posts,
				views: mockTotalStats.views,
			});

			jest.spyOn(
				commentRepository,
				"countActiveComments"
			).mockResolvedValue(mockTotalStats.comments);
			jest.spyOn(userRepository, "countActiveUsers").mockResolvedValue(
				mockTotalStats.users
			);

			jest.spyOn(postRepository, "getIntervalStats").mockResolvedValue(
				mockIntervalStats.posts
			);

			jest.spyOn(commentRepository, "getIntervalStats").mockResolvedValue(
				mockIntervalStats.comments
			);

			jest.spyOn(userRepository, "getIntervalStats").mockResolvedValue(
				mockIntervalStats.users
			);
			(mapStatsToResponse as jest.Mock).mockReturnValue(mockResponse);
		});

		describe("성공 케이스", () => {
			it("통계를 가져온다.", async () => {
				const result =
					await adminService.getStats(mockGetStatsQueryDto);

				expect(mapStatsToResponse).toHaveBeenCalledWith(
					mockTotalStats,
					mockIntervalStats
				);
				expect(mapStatsToResponse).toHaveBeenCalledTimes(1);

				expect(result).toEqual(mockResponse);
			});

			it.each([
				{ interval: "daily", dateFormat: "%Y-%m-%d" },
				{ interval: "monthly", dateFormat: "%Y-%m" },
				{ interval: "yearly", dateFormat: "%Y" },
			])(
				"interval이 $interval인 경우",
				async ({ interval, dateFormat }) => {
					mockGetStatsQueryDto.interval = interval as TInterval;

					await adminService.getStats(mockGetStatsQueryDto);

					expect(
						postRepository.getIntervalStats
					).toHaveBeenCalledWith(
						dateFormat,
						expect.any(Date),
						expect.any(Date)
					);

					expect(
						commentRepository.getIntervalStats
					).toHaveBeenCalledWith(
						dateFormat,
						expect.any(Date),
						expect.any(Date)
					);

					expect(
						userRepository.getIntervalStats
					).toHaveBeenCalledWith(
						dateFormat,
						expect.any(Date),
						expect.any(Date)
					);
				}
			);
		});

		describe("실패 케이스", () => {
			it("interval이 daily, monthly, yearly가 아닌 경우", async () => {
				mockGetStatsQueryDto.interval = "InvalidInterval" as any;
				const result = adminService.getStats(mockGetStatsQueryDto);

				await expect(result).rejects.toThrow(ServerError);
				await expect(result).rejects.toThrow(
					"잘못된 interval 값입니다."
				);
			});
		});
	});

	describe("getUserStat", () => {
		const mockUserId = 1;
		const mockUser = new User();

		const mockPostStat = {
			count: 1,
			views: 1,
		};

		const mockCommentStat = {
			count: 1,
		};

		const mockUserStat = {
			posts: 1,
			views: 1,
			comments: 1,
		};

		beforeEach(() => {
			jest.spyOn(userRepository, "findOne").mockResolvedValue(mockUser);
			jest.spyOn(postRepository, "getPostStatByUser").mockResolvedValue(
				mockPostStat
			);
			jest.spyOn(
				commentRepository,
				"getCommentStatByUser"
			).mockResolvedValue(mockCommentStat);
		});

		describe("성공 케이스", () => {
			it("유저 통계를 가져온다.", async () => {
				mockUser.nickname = "testUser";

				const result = await adminService.getUserStat(mockUserId);
				expect(userRepository.findOne).toHaveBeenCalledWith({
					where: { id: mockUserId },
				});
				expect(postRepository.getPostStatByUser).toHaveBeenCalledWith(
					mockUserId
				);
				expect(
					commentRepository.getCommentStatByUser
				).toHaveBeenCalledWith(mockUserId);
				expect(result).toEqual({
					nickname: mockUser.nickname,
					stats: mockUserStat,
				});
			});
		});

		describe("실패 케이스", () => {
			it("유저가 존재하지 않는 경우", async () => {
				jest.spyOn(userRepository, "findOne").mockResolvedValue(
					undefined
				);

				const result = adminService.getUserStat(mockUserId);

				await expect(result).rejects.toThrow(ServerError);
				await expect(result).rejects.toThrow(
					"존재 하지 않는 사용자입니다."
				);
			});
		});
	});
});
