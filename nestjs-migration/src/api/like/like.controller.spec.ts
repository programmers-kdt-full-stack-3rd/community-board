import { Test, TestingModule } from "@nestjs/testing";
import { LikeController } from "./like.controller";
import { LikeService } from "./like.service";
import { ServerError } from "../../common/exceptions/server-error.exception";
import {
	LIKE_ERROR_CODES,
	LIKE_ERROR_MESSAGES,
} from "./constant/like.constants";

describe("LikeController", () => {
	let likeController: LikeController;
	let likeService: LikeService;

	const mockPostId = 1;
	const mockUserId = 1;
	const mockCommentId = 1;
	const mockUser = {
		userId: 1,
		roleId: 1,
	};

	const mockPostLikeDto = {
		postId: mockPostId,
		userId: mockUserId,
	};

	const mockCommentLikeDto = {
		commentId: mockCommentId,
		userId: mockUserId,
	};

	const mockLikeService = {
		createPostLike: jest.fn(),
		deletePostLike: jest.fn(),
		createCommentLike: jest.fn(),
		deleteCommentLike: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [LikeController],
			providers: [
				{
					provide: LikeService,
					useValue: mockLikeService,
				},
			],
		}).compile();

		likeController = module.get<LikeController>(LikeController);
		likeService = module.get<LikeService>(LikeService);
	});

	describe("POST like/post/:post_id", () => {
		it("게시물 좋아요 추가 성공", async () => {
			mockLikeService.createPostLike.mockResolvedValue(undefined);

			await likeController.handleAddLike(mockPostId, mockUser);

			expect(likeService.createPostLike).toHaveBeenCalledWith(
				mockPostLikeDto
			);
		});
		it("이미 좋아요한 게시물이면 에러 반환", async () => {
			const mockError = ServerError.badRequest(
				LIKE_ERROR_MESSAGES.DUPLICATED_POSTS
			);
			mockError["code"] = LIKE_ERROR_CODES.DUPLICATED;

			mockLikeService.createPostLike.mockRejectedValue(mockError);

			await expect(
				likeController.handleAddLike(mockCommentId, mockUser)
			).rejects.toThrow(mockError);
		});
		it("없는 게시물이면 에러 반환", async () => {
			const mockError = ServerError.notFound(
				LIKE_ERROR_MESSAGES.NOT_FOUND_POST
			);
			mockError["code"] = LIKE_ERROR_CODES.NO_REFRERENCED;
			mockLikeService.createPostLike.mockRejectedValue(mockError);

			await expect(
				likeController.handleAddLike(mockCommentId, mockUser)
			).rejects.toThrow(mockError);
		});
	});

	describe("DELETE like/post/:post_id", () => {
		it("게시물 좋아요 삭제 성공", async () => {
			mockLikeService.deletePostLike.mockResolvedValue(undefined);

			await likeController.handleDeleteLike(mockPostId, mockUser);

			expect(likeService.deletePostLike).toHaveBeenCalledWith(
				mockPostLikeDto
			);
		});
		it("게시물 좋아요 삭제 실패", async () => {
			const mockError = ServerError.reference("mock error");
			mockLikeService.deletePostLike.mockRejectedValue(mockError);

			await expect(
				likeController.handleDeleteLike(mockCommentId, mockUser)
			).rejects.toThrow(mockError);
		});
	});

	describe("POST like/comment/:comment_id", () => {
		it("댓글 좋아요 추가 성공", async () => {
			mockLikeService.createCommentLike.mockResolvedValue(undefined);

			await likeController.handleAddCommentLike(mockCommentId, mockUser);

			expect(likeService.createCommentLike).toHaveBeenCalledWith(
				mockCommentLikeDto
			);
		});
		it("이미 좋아요한 댓글이면 에러 반환", async () => {
			const mockError = ServerError.badRequest(
				LIKE_ERROR_MESSAGES.DUPLICATED_COMMENTS
			);
			mockError["code"] = LIKE_ERROR_CODES.DUPLICATED;

			mockLikeService.createCommentLike.mockRejectedValue(mockError);

			await expect(
				likeController.handleAddCommentLike(mockCommentId, mockUser)
			).rejects.toThrow(mockError);
		});
		it("없는 댓글이면 에러 반환", async () => {
			const mockError = ServerError.notFound(
				LIKE_ERROR_MESSAGES.NOT_FOUND_COMMENT
			);
			mockError["code"] = LIKE_ERROR_CODES.NO_REFRERENCED;

			mockLikeService.createCommentLike.mockRejectedValue(mockError);

			await expect(
				likeController.handleAddCommentLike(mockCommentId, mockUser)
			).rejects.toThrow(mockError);
		});
	});

	describe("POST like/comment/:comment_id", () => {
		it("댓글 좋아요 삭제 성공", async () => {
			mockLikeService.deleteCommentLike.mockResolvedValue(undefined);

			await likeController.handleDeleteCommentLike(
				mockCommentId,
				mockUser
			);

			expect(likeService.deleteCommentLike).toHaveBeenCalledWith(
				mockCommentLikeDto
			);
		});
		it("댓글 좋아요 삭제 실패", async () => {
			const mockError = ServerError.reference("mock error");
			mockLikeService.deleteCommentLike.mockRejectedValue(mockError);

			await expect(
				likeController.handleDeleteCommentLike(mockCommentId, mockUser)
			).rejects.toThrow(mockError);
		});
	});
});
