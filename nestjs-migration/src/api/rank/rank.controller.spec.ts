import { Test, TestingModule } from "@nestjs/testing";
import { RankController } from "./rank.controller";
import { RankService } from "./rank.service";
import { ServerError } from "src/common/exceptions/server-error.exception";
import { RANK_ERROR_MESSAGES } from "./constant/rank.constants";

describe("RankController", () => {
	let rankController: RankController;
	let rankService: RankService;

	const mockRankService = {
		getTopPosts: jest.fn(),
		getTopComments: jest.fn(),
		getTopActivities: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [RankController],
			providers: [
				{
					provide: RankService,
					useValue: mockRankService,
				},
			],
		}).compile();

		rankController = module.get<RankController>(RankController);
		rankService = module.get<RankService>(RankService);
	});

	describe("GET /rank/posts", () => {
		const mockResult = [
			{
				title: "mock title",
				nickname: "mock nickname",
				likeCount: 10,
			},
			{
				title: "mock title",
				nickname: "mock nickname",
				likeCount: 7,
			},
		];

		it("상위 게시글들 조회 성공", async () => {
			mockRankService.getTopPosts.mockResolvedValue(mockResult);

			const result = await rankController.handleTopPosts();

			expect(rankService.getTopPosts).toHaveBeenCalled();
			expect(result).toEqual(mockResult);
		});
		it("상위 게시글들 조회 실패", async () => {
			const mockError = ServerError.reference(
				RANK_ERROR_MESSAGES.GET_TOP_POSTS_ERROR
			);
			mockRankService.getTopPosts.mockRejectedValue(mockError);

			await expect(rankController.handleTopPosts()).rejects.toThrow(
				mockError
			);
		});
	});

	describe("GET /rank/comments", () => {
		const mockResult = [
			{
				nickname: "mock nickname",
				likeCount: 10,
			},
			{
				nickname: "mock nickname",
				likeCount: 7,
			},
		];
		it("상위 댓글들 조회 성공", async () => {
			mockRankService.getTopComments.mockResolvedValue(mockResult);

			const result = await rankController.handleTopComments();

			expect(rankService.getTopComments).toHaveBeenCalled();
			expect(result).toEqual(mockResult);
		});
		it("상위 댓글들 조회 실패", async () => {
			const mockError = ServerError.reference(
				RANK_ERROR_MESSAGES.GET_TOP_COMMENTS_ERROR
			);
			mockRankService.getTopComments.mockRejectedValue(mockError);

			await expect(rankController.handleTopComments()).rejects.toThrow(
				mockError
			);
		});
	});

	describe("GET /rank/activities", () => {
		const mockResult = [
			{
				nickname: "mock nickname",
				postCount: 10,
				commentCount: 5,
			},
			{
				nickname: "mock nickname",
				likeCount: 7,
				commentCount: 2,
			},
		];
		it("상위 활동들 조회 성공", async () => {
			mockRankService.getTopActivities.mockResolvedValue(mockResult);

			const result = await rankController.handleTopActivators();

			expect(rankService.getTopActivities).toHaveBeenCalled();
			expect(result).toEqual(mockResult);
		});
		it("상위 활동들 조회 실패", async () => {
			const mockError = ServerError.reference(
				RANK_ERROR_MESSAGES.GET_TOP_ACTIVITIES_ERROR
			);
			mockRankService.getTopActivities.mockRejectedValue(mockError);

			await expect(rankController.handleTopActivators()).rejects.toThrow(
				mockError
			);
		});
	});
});
