import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { CommentRepository } from './comment.repository';
import { DataSource } from 'typeorm';
import { ServerError } from '../common/exceptions/server-error.exception';

describe('CommentService', () => {
  let commentService: CommentService;
  let commentRepository: CommentRepository;
  let dataSource: DataSource;

  const mockUserId = 1;
  const mockPostId = 1;
  const mockCommentId =1;

  const mockCommentRepository = {
    getTotalComments: jest.fn(),
    getComments: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    findOne: jest.fn()

  };
  const mockDataSource = {
		createQueryRunner: jest.fn(),
	};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommentService,
        {
          provide: CommentRepository,
          useValue: mockCommentRepository,
        },
        {
					provide: DataSource,
					useValue: mockDataSource,
				},
      ],
    }).compile();

    commentService = module.get<CommentService>(CommentService);
    commentRepository = module.get<CommentRepository>(CommentRepository);
		dataSource = module.get<DataSource>(DataSource);
  });

  describe("createComment", () => {
    const mockQueryRunner = {
			connect: jest.fn(),
			startTransaction: jest.fn(),
			commitTransaction: jest.fn(),
			rollbackTransaction: jest.fn(),
			release: jest.fn(),
			manager: {
				save: jest.fn(),
				getRepository: jest.fn().mockReturnValue({
					save: jest.fn(),
				  })
        }
    };
    mockDataSource.createQueryRunner.mockReturnValue(mockQueryRunner);
    const mockCreateCmtDto = {
      content: "mock content",
      post_id: mockPostId,
      authorId: mockUserId
    }
    it("댓글 생성 성공", async () => {
      mockQueryRunner.manager.save.mockResolvedValue(undefined);

      await commentService.createComment(mockCreateCmtDto);

      expect(mockQueryRunner.connect).toHaveBeenCalled();
			expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
			expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
			expect(mockQueryRunner.release).toHaveBeenCalled();
    });
    it("댓글 생성 중 오류 발생 시 롤백된다", async () => {
      const mockError = new Error("트랜잭션 중 에러 발생");
			mockQueryRunner.manager.save.mockResolvedValue(undefined);
			mockQueryRunner.manager.getRepository().save.mockRejectedValue(mockError);

			await expect(
				commentService.createComment(mockCreateCmtDto)
			).rejects.toThrow(mockError);

			expect(mockQueryRunner.connect).toHaveBeenCalled();
			expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
			expect(mockQueryRunner.release).toHaveBeenCalled();
    });
  });

  describe('getTotal', () => { 
    it("댓글 개수 조회 성공 시 개수 결과를 반환한다", async () => {
      const mockTotal = 5;
      mockCommentRepository.getTotalComments.mockResolvedValue(mockTotal);

      await commentService.getTotal(mockPostId);

      expect(commentRepository.getTotalComments).toHaveBeenCalledWith(mockPostId);
    });
    it("댓글 개수 조회 중 오류 발생 시 에러를 반환한다", async () => {
      const mockError = ServerError.badRequest("mock error 발생");

      mockCommentRepository.getTotalComments.mockRejectedValue(mockError);

      await expect(
        commentService.getTotal(mockPostId)
      ).rejects.toThrow(mockError);

    });
  });

  describe('readComments', () => {
    const mockReadCmtDto = {
      post_id: mockPostId,
    }
    const mockCmtDto = [{
      id: mockCommentId,
      content: "mock",
      author_id: mockUserId,
      author_nickname: "moon",
      is_author: false,
      created_at: "",
      likes: 0,
      user_liked: false,
    }]
    it("댓글 조회 성공 시 결과를 반환한다", async () => {
      mockCommentRepository.getComments.mockResolvedValue(mockCmtDto);

      const result = await commentService.readComments(mockReadCmtDto);

      expect(commentRepository.getComments).toHaveBeenCalledWith(mockReadCmtDto);
      expect(result).toEqual(mockCmtDto);

    });
    it("댓글 조회 중 오류 발생 시 에러를 반환한다", async () => {
      const mockError = ServerError.badRequest("mock error 발생");

      mockCommentRepository.getComments.mockRejectedValue(mockError);

      await expect(
        commentService.readComments(mockReadCmtDto)
      ).rejects.toThrow(mockError);
    });
  });

  describe('updateComment', () => { 
    const mockComment = {
      id: mockCommentId,
    };
    const mockUpdateCmtDto = {
      id: mockCommentId,
      authorId: mockUserId,
      content: "mock"
    }
    it("댓글 수정 성공", async () => {
      mockCommentRepository.findOne.mockResolvedValue(mockComment);
      mockCommentRepository.update.mockResolvedValue(true);

      const result = await commentService.updateComment(mockUpdateCmtDto);

      expect(commentRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUpdateCmtDto.id },
      });
      expect(commentRepository.update).toHaveBeenCalledWith(
        { id: mockUpdateCmtDto.id, 
          author: mockUpdateCmtDto.authorId, 
          isDelete: false },
        { content: mockUpdateCmtDto.content },
      );
      expect(result).toBe(true);
    });
    it("댓글 수정 중 오류 발생 시 에러를 반환한다", async () => {
      jest.clearAllMocks();
      mockCommentRepository.findOne.mockResolvedValue(null);

      await expect(commentService.updateComment(mockUpdateCmtDto)).rejects.toThrow(
        ServerError.notFound("존재하지 않는 댓글입니다."),
      );

      expect(commentRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUpdateCmtDto.id },
      });
      expect(commentRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteComment', () => { 
    const mockDeleteCmtDto = {
      id: mockCommentId,
      authorId: mockUserId
    }
    it("댓글 삭제 성공", async () => {
      mockCommentRepository.update.mockResolvedValue({ 
        raw: {},
        generatedMaps : [],
        affected: true
      });

      await commentService.deleteComment(mockDeleteCmtDto);

      expect(commentRepository.update).toHaveBeenCalledWith(
        { id: mockDeleteCmtDto.id, 
          author: mockDeleteCmtDto.authorId, 
          isDelete: false },
        { isDelete: true },
      );
    });
    it("댓글 삭제 중 오류 발생 시 에러를 반환한다", async () => {
      const mockError = new Error("mock error");

      mockCommentRepository.update.mockRejectedValue(mockError);

      await expect(commentService.deleteComment(mockDeleteCmtDto)).rejects.toThrow(mockError);
    });
  });
});
