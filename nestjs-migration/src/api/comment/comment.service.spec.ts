import { Test, TestingModule } from "@nestjs/testing";
import { CommentService } from "./comment.service";
import { CommentRepository } from "./comment.repository";
import { DataSource, QueryRunner } from "typeorm";
import { ServerError } from "../../common/exceptions/server-error.exception";
import { Log } from "../log/entities/log.entity";
import {
	COMMENT_ERROR_CODES,
	COMMENT_ERROR_MESSAGES,
} from "./constant/comment.constants";

describe("CommentService", () => {
	let commentService: CommentService;
	let commentRepository: CommentRepository;
	let dataSource: DataSource;
	let queryRunner: QueryRunner;

	const qr = {
		manager: {},
	} as QueryRunner;

	const mockUserId = 1;
	const mockPostId = 1;
	const mockCommentId = 1;

	const mockCommentRepository = {
		getTotalComments: jest.fn(),
		getComments: jest.fn(),
		save: jest.fn(),
		update: jest.fn(),
		findOne: jest.fn(),
	};

	beforeEach(async () => {
		Object.assign(qr.manager, {
			save: jest.fn(),
			getRepository: jest.fn().mockReturnValue({
				save: jest.fn(),
			}),
		});
		qr.connect = jest.fn();
		qr.release = jest.fn();
		qr.startTransaction = jest.fn();
		qr.commitTransaction = jest.fn();
		qr.rollbackTransaction = jest.fn();
		qr.release = jest.fn();

		const mockDataSource = {
			createQueryRunner: jest.fn().mockReturnValue(qr),
		};
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CommentService,
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
		queryRunner = dataSource.createQueryRunner();
	});

	describe("createComment", () => {
		const mockCreateCmtDto = {
			content: "mock content",
			post_id: mockPostId,
			authorId: mockUserId,
		};
		it("댓글 생성 성공", async () => {
			await commentService.createComment(mockCreateCmtDto);

			expect(queryRunner.connect).toHaveBeenCalled();
			expect(queryRunner.startTransaction).toHaveBeenCalled();
			expect(queryRunner.manager.save).toHaveBeenCalledTimes(1);
			expect(queryRunner.manager.getRepository).toHaveBeenCalledWith(Log);
			expect(queryRunner.commitTransaction).toHaveBeenCalled();
			expect(queryRunner.release).toHaveBeenCalled();
		});
		it("없는 게시물에 댓글을 생성하면 롤백된다", async () => {
			const mockError = ServerError.notFound(
				COMMENT_ERROR_MESSAGES.NOT_FOUND_POST_ID
			);

			mockError["code"] = COMMENT_ERROR_CODES.NO_REFERENCE;
			jest.spyOn(queryRunner.manager, "save").mockRejectedValue(
				mockError
			);

			await expect(
				commentService.createComment(mockCreateCmtDto)
			).rejects.toThrow(mockError);

			expect(queryRunner.startTransaction).toHaveBeenCalled();
			expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
			expect(queryRunner.release).toHaveBeenCalled();
		});
	});

	describe("getTotal", () => {
		it("댓글 개수 조회 성공 시 개수 결과를 반환한다", async () => {
			const mockTotal = 5;
			mockCommentRepository.getTotalComments.mockResolvedValue(mockTotal);

			await commentService.getTotal(mockPostId);

			expect(commentRepository.getTotalComments).toHaveBeenCalledWith(
				mockPostId
			);
		});
		it("댓글 개수 조회 중 오류 발생 시 에러를 반환한다", async () => {
			const mockError = ServerError.badRequest(
				COMMENT_ERROR_MESSAGES.READ_COMMENT_ERROR
			);

			mockCommentRepository.getTotalComments.mockRejectedValue(mockError);

			await expect(commentService.getTotal(mockPostId)).rejects.toThrow(
				mockError
			);
		});
	});

	describe("readComments", () => {
		const mockReadCmtDto = {
			post_id: mockPostId,
		};
		const mockCmtDto = [
			{
				id: mockCommentId,
				content: "mock",
				author_id: mockUserId,
				author_nickname: "moon",
				is_author: false,
				created_at: "",
				likes: 0,
				user_liked: false,
			},
		];
		it("댓글 조회 성공 시 결과를 반환한다", async () => {
			mockCommentRepository.getComments.mockResolvedValue(mockCmtDto);

			const result = await commentService.readComments(mockReadCmtDto);

			expect(commentRepository.getComments).toHaveBeenCalledWith(
				mockReadCmtDto
			);
			expect(result).toEqual(mockCmtDto);
		});
		it("댓글 조회 중 오류 발생 시 에러를 반환한다", async () => {
			const mockError = ServerError.badRequest(
				COMMENT_ERROR_MESSAGES.READ_COMMENT_ERROR
			);

			mockCommentRepository.getComments.mockRejectedValue(mockError);

			await expect(
				commentService.readComments(mockReadCmtDto)
			).rejects.toThrow(mockError);
		});
	});

	describe("updateComment", () => {
		const mockComment = {
			id: mockCommentId,
		};
		const mockUpdateCmtDto = {
			id: mockCommentId,
			authorId: mockUserId,
			content: "mock",
		};
		it("댓글 수정 성공", async () => {
			mockCommentRepository.update.mockResolvedValue({
				affected: 1,
			});

			const result = await commentService.updateComment(mockUpdateCmtDto);

			expect(commentRepository.update).toHaveBeenCalledWith(
				{
					id: mockUpdateCmtDto.id,
					author: mockUpdateCmtDto.authorId,
					isDelete: false,
				},
				{ content: mockUpdateCmtDto.content }
			);
			expect(result).toBe(true);
		});
		it("댓글 수정 중 오류 발생 시 에러를 반환한다", async () => {
			mockCommentRepository.update.mockResolvedValue({
				affected: 0,
			});

			await expect(
				commentService.updateComment(mockUpdateCmtDto)
			).rejects.toThrow(
				ServerError.reference(
					COMMENT_ERROR_MESSAGES.UPDATE_COMMENT_ERROR
				)
			);
		});
	});

	describe("deleteComment", () => {
		const mockDeleteCmtDto = {
			id: mockCommentId,
			authorId: mockUserId,
		};
		it("댓글 삭제 성공", async () => {
			mockCommentRepository.update.mockResolvedValue({
				affected: true,
			});

			await commentService.deleteComment(mockDeleteCmtDto);

			expect(commentRepository.update).toHaveBeenCalledWith(
				{
					id: mockDeleteCmtDto.id,
					author: mockDeleteCmtDto.authorId,
					isDelete: false,
				},
				{ isDelete: true }
			);
		});
		it("댓글 삭제 중 오류 발생 시 에러를 반환한다", async () => {
			const mockError = new Error(
				COMMENT_ERROR_MESSAGES.DELETE_COMMENT_ERROR
			);

			mockCommentRepository.update.mockRejectedValue(mockError);

			await expect(
				commentService.deleteComment(mockDeleteCmtDto)
			).rejects.toThrow(mockError);
		});
	});
});
