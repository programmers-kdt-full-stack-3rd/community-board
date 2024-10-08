import { Test, TestingModule } from "@nestjs/testing";
import { RankService } from "./rank.service";
import { UserRepository } from "src/user/user.repository";
import { PostRepository } from "src/post/post.repository";
import { CommentRepository } from "src/comment/comment.repository";
import { ServerError } from "src/common/exceptions/server-error.exception";
import { RANK_ERROR_MESSAGES } from "./constant/rank.constants";

describe("RankService", () => {
	let rankService: RankService;
	let userRepository: UserRepository;
	let postRepository: PostRepository;
	let commentRepository: CommentRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				RankService,
				{
					provide: UserRepository,
					useValue: {
						getTopUserActivities: jest.fn(),
					},
				},
				{
					provide: PostRepository,
					useValue: {
						getTopPosts: jest.fn(),
					},
				},
				{
					provide: CommentRepository,
					useValue: {
						getTopComments: jest.fn(),
					},
				},
			],
		}).compile();

		rankService = module.get<RankService>(RankService);
		userRepository = module.get<UserRepository>(UserRepository);
		postRepository = module.get<PostRepository>(PostRepository);
		commentRepository = module.get<CommentRepository>(CommentRepository);
	});
	describe("getTopPosts", () => {
		const mockResult = [
			{
				title: "mock title",
				nickname: "mock nickname",
				likeCount: 10,
				postId: 1,
			},
			{
				title: "mock title",
				nickname: "mock nickname",
				likeCount: 7,
				postId: 2,
			},
		];
		it("DB에서 게시물 top5를 가져오는데 성공한다", async () => {
			jest.spyOn(postRepository, "getTopPosts").mockResolvedValue(
				mockResult
			);

			const result = await rankService.getTopPosts();

			expect(result).toEqual(mockResult);
			expect(postRepository.getTopPosts).toHaveBeenCalled();
		});
		it("게시글 top5를 가져오는 도중 에러가 발생한다", async () => {
			jest.spyOn(postRepository, "getTopPosts").mockRejectedValue(
				ServerError.reference(RANK_ERROR_MESSAGES.GET_TOP_POSTS_ERROR)
			);

			await expect(postRepository.getTopPosts).rejects.toThrow(
				ServerError.reference(RANK_ERROR_MESSAGES.GET_TOP_POSTS_ERROR)
			);
		});
	});

	describe("getTopComments", () => {
		const mockResult = [
			{
				nickname: "mock nickname",
				likeCount: 10,
				commentId: 1,
				postId: 2,
			},
			{
				nickname: "mock nickname",
				likeCount: 7,
				commentId: 2,
				postId: 2,
			},
		];
		it("DB에서 댓글 top5를 가져오는데 성공한다", async () => {
			jest.spyOn(commentRepository, "getTopComments").mockResolvedValue(
				mockResult
			);

			const result = await rankService.getTopComments();

			expect(result).toEqual(mockResult);
			expect(commentRepository.getTopComments).toHaveBeenCalled();
		});
		it("댓글 top5를 가져오는 도중 에러가 발생한다", async () => {
			jest.spyOn(commentRepository, "getTopComments").mockRejectedValue(
				ServerError.reference(
					RANK_ERROR_MESSAGES.GET_TOP_COMMENTS_ERROR
				)
			);

			await expect(commentRepository.getTopComments).rejects.toThrow(
				ServerError.reference(
					RANK_ERROR_MESSAGES.GET_TOP_COMMENTS_ERROR
				)
			);
		});
	});

	describe("getTopActivities", () => {
		const mockResult = [
			{
				nickname: "mock nickname",
				postCount: 10,
				commentCount: 5,
			},
			{
				nickname: "mock nickname",
				postCount: 7,
				commentCount: 2,
			},
		];
		it("DB에서 활동 top5를 가져오는데 성공한다", async () => {
			jest.spyOn(
				userRepository,
				"getTopUserActivities"
			).mockResolvedValue(mockResult);

			const result = await rankService.getTopActivities();

			expect(result).toEqual(mockResult);
			expect(userRepository.getTopUserActivities).toHaveBeenCalled();
		});
		it("활동 top5를 가져오는 도중 에러가 발생한다", async () => {
			jest.spyOn(
				userRepository,
				"getTopUserActivities"
			).mockRejectedValue(
				ServerError.reference(
					RANK_ERROR_MESSAGES.GET_TOP_ACTIVITIES_ERROR
				)
			);

			await expect(userRepository.getTopUserActivities).rejects.toThrow(
				ServerError.reference(
					RANK_ERROR_MESSAGES.GET_TOP_ACTIVITIES_ERROR
				)
			);
		});
	});
});
