import { Test, TestingModule } from '@nestjs/testing';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { ServerError } from '../common/exceptions/server-error.exception';

describe('LikeController', () => {
  let likeController: LikeController;
  let likeService: LikeService;

  const mockPostId = 1;
  const mockUserId = 1;
  const mockCommentId = 1;
  const mockReq = {
		user: { userId: mockUserId },
	} as any;

  const mockPostLikeDto = {
    postId: mockPostId,
    userId: mockUserId,
  }

  const mockCommentLikeDto = {
      commentId: mockCommentId,
      userId: mockUserId,
  }

  const mockLikeService = {
    createPostLike: jest.fn(),
    deletePostLike: jest.fn(),
    createCommentLike: jest.fn(),
    deleteCommentLike: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LikeController],
      providers: [
        {
          provide: LikeService,
          useValue: mockLikeService,
        }],
    }).compile();

    likeController = module.get<LikeController>(LikeController);
    likeService = module.get<LikeService>(LikeService);
  });

  describe("POST like/post/:post_id", () => {
    it("게시물 좋아요 추가 성공", async() => {

      mockLikeService.createPostLike.mockResolvedValue(undefined);

      await likeController.handleAddLike(mockPostId, mockReq);

      expect(likeService.createPostLike).toHaveBeenCalledWith(mockPostLikeDto);
    });
    it("게시물 좋아요 추가 실패", async() => {
      const mockError = ServerError.reference("mock error");
      mockLikeService.createPostLike.mockRejectedValue(mockError);

      await expect(likeController.handleAddLike(mockCommentId,mockReq)).rejects.toThrow(mockError);
    });
  });

  describe("DELETE like/post/:post_id", () => {
    it("게시물 좋아요 삭제 성공", async() => {
      mockLikeService.deletePostLike.mockResolvedValue(undefined);

      await likeController.handleDeleteLike(mockPostId, mockReq);

      expect(likeService.deletePostLike).toHaveBeenCalledWith(mockPostLikeDto);
    });
    it("게시물 좋아요 삭제 실패", async() => {
      const mockError = ServerError.reference("mock error");
      mockLikeService.deletePostLike.mockRejectedValue(mockError);

      await expect(likeController.handleDeleteLike(mockCommentId,mockReq)).rejects.toThrow(mockError);
    });
  });

  describe("POST like/comment/:comment_id", () => {
    it("댓글 좋아요 추가 성공", async() => {
      mockLikeService.createCommentLike.mockResolvedValue(undefined);

      await likeController.handleAddCommentLike(mockCommentId, mockReq);

      expect(likeService.createCommentLike).toHaveBeenCalledWith(mockCommentLikeDto);
    });
    it("댓글 좋아요 추가 실패", async() => {
      const mockError = ServerError.reference("mock error");
      mockLikeService.createCommentLike.mockRejectedValue(mockError);

      await expect(likeController.handleAddCommentLike(mockCommentId,mockReq)).rejects.toThrow(mockError);
    });
  });

  describe("POST like/comment/:comment_id", () => {
    it("댓글 좋아요 삭제 성공", async() => {
      mockLikeService.deleteCommentLike.mockResolvedValue(undefined);

      await likeController.handleDeleteCommentLike(mockCommentId, mockReq);

      expect(likeService.deleteCommentLike).toHaveBeenCalledWith(mockCommentLikeDto);
    });
    it("댓글 좋아요 삭제 실패", async() => {
      const mockError = ServerError.reference("mock error");
      mockLikeService.deleteCommentLike.mockRejectedValue(mockError);

      await expect(likeController.handleDeleteCommentLike(mockCommentId,mockReq)).rejects.toThrow(mockError);
    });
  });
});
