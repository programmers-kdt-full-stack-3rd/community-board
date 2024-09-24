import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { ServerError } from '../common/exceptions/server-error.exception';

describe('CommentController', () => {
  let commentController: CommentController;
  let commentService: CommentService;

  const mockCommentService = {
    createComment: jest.fn(),
    getTotal: jest.fn(),
    readComments: jest.fn(),
    updateComment: jest.fn(),
    deleteComment: jest.fn(),
  }
  const mockPostId = 1;
  const mockUserId = 1;
  const mockCommentId = 1;
  const mockReq = {
		user: { userId: mockUserId },
	} as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [
        {
          provide: CommentService,
          useValue: mockCommentService,
        }
      ],
    }).compile();

    commentController = module.get<CommentController>(CommentController);
    commentService = module.get<CommentService>(CommentService);
  });

  describe("POST /comment", () => {
    it("댓글 생성 성공", async () => {
      const mockCreateCmtBodyDto = {
        content: "mock content",
        post_id: mockPostId,
      };
      const mockCreateCmtDto = {
        content: "mock content",
        post_id: mockPostId,
        authorId: mockUserId,
      };
      
      await commentController.handleCommentCreate(mockCreateCmtBodyDto, mockReq);

      expect(commentService.createComment).toHaveBeenCalledWith(mockCreateCmtDto);
    });
    it("댓글 생성 중 문제 발생 시 에러를 반환한다", async () => {
      const mockCreateCmtBodyDto = {
        content: "mock content",
        post_id: mockPostId,
      };
      const mockCreateCmtDto = {
        content: "mock content",
        post_id: mockPostId,
        authorId: mockUserId,
      };
      const mockError = ServerError.badRequest("댓글 생성 중 문제 발생");

      mockCommentService.createComment.mockRejectedValue(mockError);

      await expect(
        commentController.handleCommentCreate(mockCreateCmtBodyDto, mockReq),
      ).rejects.toThrow(mockError);
    });
  });

  describe("GET /comment", () => {
    const mockTotal = 5;
    const mockReadCmtQueryDto = {
      post_id: mockPostId
    };
    const mockReadCmtResult = [
      {"id": 9,
      "content": "this is a comment",
      "author_id": 1,
      "author_nickname": "moon",
      "is_author": true,
      "created_at": "2024-09-18T08:15:09.000Z",
      "updated_at": null,
      "user_liked": false,
      "likes": 0
      }
    ];

    it("댓글 조회 성공", async () => {
      mockCommentService.getTotal.mockResolvedValue(mockTotal);
      mockCommentService.readComments.mockResolvedValue(mockReadCmtResult);

      const result = await commentController.handleCommentsRead(mockReadCmtQueryDto, mockReq);
      expect(result).toEqual(
        {total: mockTotal, comments: mockReadCmtResult}
      );
    });
    it("댓글 조회 중 문제 발생 시 에러를 반환한다", async () => {
      const mockError = ServerError.badRequest("댓글 조회 중 문제 발생");

      mockCommentService.getTotal.mockResolvedValue(mockTotal);
      mockCommentService.readComments.mockRejectedValue(mockError);

      await expect(
        commentController.handleCommentsRead(mockReadCmtQueryDto, mockReq),
      ).rejects.toThrow(mockError);
    });
  });

  describe("PATCH /comment", () => {
    const mockUpdateCmtBodyDto = {
      id: mockCommentId,
      content: "mock Content"
    }
    const mockUpdateCmtDto = {
      id: mockCommentId,
      authorId: mockUserId,
      content: "mock Content",
    }
    it("댓글 수정 성공", async () => {
      mockCommentService.updateComment.mockResolvedValue(true);

      await commentController.handleCommentUpdate(mockUpdateCmtBodyDto, mockReq);

      expect(commentService.updateComment).toHaveBeenCalledWith(mockUpdateCmtDto);

    });
    it("댓글 수정 중 문제 발생 시 에러를 반환한다", async () => {
      const mockError = ServerError.badRequest("댓글 수정 중 문제 발생");

      mockCommentService.updateComment.mockRejectedValue(mockError);

      await expect(
        commentController.handleCommentUpdate(mockUpdateCmtBodyDto, mockReq),
      ).rejects.toThrow(mockError);
    });
  });
  
  describe("DELETE /comment/:comment_id", () => {
    const mockDeleteCmtDto = {
      id: mockCommentId,
      authorId: mockUserId,
    };
    it("댓글 삭제 성공", async () => {
      mockCommentService.deleteComment.mockResolvedValue(true);

      await commentController.handleCommentDelete(mockCommentId, mockReq);

      expect(commentService.deleteComment).toHaveBeenCalledWith(mockDeleteCmtDto);
    });
    it("댓글 삭제 중 문제 발생 시 에러를 반환한다", async () => {
      const mockError = ServerError.badRequest("댓글 삭제 중 문제 발생");

      mockCommentService.deleteComment.mockRejectedValue(mockError);

      await expect(
        commentController.handleCommentDelete(mockCommentId, mockReq),
      ).rejects.toThrow(mockError);
    });
  });
});
