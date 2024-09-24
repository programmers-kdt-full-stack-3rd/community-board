import { Test, TestingModule } from '@nestjs/testing';
import { LikeService } from './like.service';
import { CommentLikeRepository, LikeRepository } from './like.repository';
import { ServerError } from '../common/exceptions/server-error.exception';

describe('LikeService', () => {
  let likeService: LikeService;
  let likeRepository: LikeRepository;
  let commentLikeRepository: CommentLikeRepository;


  const mockPostId = 1;
  const mockCommentId = 1;
  const mockUserId = 1;

  const mockLikePostDto = {
    postId: mockPostId,
    userId: mockUserId
  };
  const mockCommentDto = {
    commentId: mockCommentId,
    userId: mockUserId
  }

  const mockLikeRepository = {
    save: jest.fn(),
    delete: jest.fn()
  };
  const mockCommentLikeRepository = {
    save: jest.fn(),
    delete: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikeService,
      {
        provide: LikeRepository,
        useValue: mockLikeRepository
      },
      {
        provide: CommentLikeRepository,
        useValue: mockCommentLikeRepository
      }],
    }).compile();

    likeService = module.get<LikeService>(LikeService);
    likeRepository = module.get<LikeRepository>(LikeRepository);
    commentLikeRepository = module.get<CommentLikeRepository>(CommentLikeRepository);
  });

  describe("createPostLike", () => {
    it("게시물 좋아요 save 성공", async () => {
      mockLikeRepository.save.mockResolvedValue(undefined);

      await likeService.createPostLike(mockLikePostDto);

      expect(likeRepository.save).toHaveBeenCalledWith({
        post: mockLikePostDto.postId,
        user: mockLikePostDto.userId
      });
    });
    it("게시물 좋아요 save 실패", async () => {
      const mockError = ServerError.reference("mock error")
      mockLikeRepository.save.mockRejectedValue(mockError);

      await expect(likeService.createPostLike(mockLikePostDto)).rejects.toThrow(mockError);
    });
  });

  describe("deletePostLike", () => {
    it("게시물 좋아요 delete 성공", async () => {
      mockLikeRepository.delete.mockResolvedValue(
        { affected: 1 }
      );

      await likeService.deletePostLike(mockLikePostDto);

      expect(likeRepository.delete).toHaveBeenCalledWith({
        post: mockLikePostDto.postId,
        user: mockLikePostDto.userId,
      });
    });
    it("게시물 좋아요 delete 실패", async () => {
      mockLikeRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(likeService.deletePostLike(mockLikePostDto)).rejects.toThrow(
        ServerError.reference('게시글 좋아요 취소 실패')
      );
    });
    it("게시물 좋아요 delete 쿼리 중간에 실패 시 예외 반환", async () => {
      mockLikeRepository.delete.mockRejectedValue(new Error());

      await expect(likeService.deletePostLike(mockLikePostDto)).rejects.toThrow(Error); 
    });
  });

  describe("createCommentLike", () => {
    it("댓글 좋아요 save 성공", async () => {
      await likeService.createCommentLike(mockCommentDto);

      expect(commentLikeRepository.save).toHaveBeenCalledWith({
        comment: mockCommentDto.commentId,
        user: mockCommentDto.userId,
      });
    });
    it("댓글 좋아요 save 실패", async () => {
      const mockError = ServerError.reference("mock error")
      mockCommentLikeRepository.save.mockRejectedValue(mockError);

      await expect(likeService.createCommentLike(mockCommentDto)).rejects.toThrow(mockError);

    });
  });

  describe("deleteCommentLike", () => {
    it("댓글 좋아요 delete 성공", async () => {
      mockCommentLikeRepository.delete.mockResolvedValue({ affected: 1 });

      await likeService.deleteCommentLike(mockCommentDto);

      expect(commentLikeRepository.delete).toHaveBeenCalledWith({
        comment: mockCommentDto.commentId,
        user: mockCommentDto.userId,
      });
    });
    it("댓글 좋아요 delete 실패", async () => {
      mockCommentLikeRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(likeService.deleteCommentLike(mockCommentDto)).rejects.toThrow(
        ServerError.reference('댓글 좋아요 취소 실패')
      );
    });
    it("댓글 좋아요 delete 쿼리 중간에 실패 시 에러 반환", async () => {
      mockCommentLikeRepository.delete.mockRejectedValue(new Error());

      await expect(likeService.deleteCommentLike(mockCommentDto)).rejects.toThrow(Error);
    });
  });
});
