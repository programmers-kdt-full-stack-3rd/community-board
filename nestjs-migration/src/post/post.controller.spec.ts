import { Test, TestingModule } from "@nestjs/testing";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import {  CreatePostDto } from "./dto/create-post.dto";
import { ServerError } from "../common/exceptions/server-error.exception";
import { POST_ERROR_MESSAGES } from "./constant/post.constants";

describe("PostController", () => {
	let postController: PostController;
	let postService: PostService;

	const mockPostService = {
		createPost: jest.fn(),
		findPostHeaders: jest.fn(),
		findPostTotal: jest.fn(),
		findPost: jest.fn(),
		updatePost: jest.fn(),
		deletePost: jest.fn(),
	};

	let mockReq: any;
	let mockUserId: number;
	let mockPostId: number;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [PostController],
			providers: [
				{
					provide: PostService,
					useValue: mockPostService,
				},
			],
		}).compile();

		postController = module.get<PostController>(PostController);
		postService = module.get<PostService>(PostService);

		mockUserId = 1;
		mockPostId = 9;
		mockReq = {
			user: { userId: mockUserId },
		} as any;
	});

	describe("POST /post", () => {
		const mockCreatePostDto: CreatePostDto = {
			title: "Test Title",
			content: "Test Content",
      authorId: mockUserId,
			doFilter: true,
		};

		it("게시물 생성 성공", async () => {
			jest.spyOn(mockPostService, "createPost").mockResolvedValue(
				mockPostId
			);
			const result = await postController.handlePostCreate(
				mockCreatePostDto,
				mockReq
			);

			expect(postService.createPost).toHaveBeenCalledWith(
				{...mockCreatePostDto, author_id: mockUserId}
			);
			expect(result).toEqual({
				postId: mockPostId,
				message: "게시글 생성 success",
			});
		});

		it("게시물 생성 중 문제 발생 시 에러를 반환한다.", async () => {
			const invalidPostDto = {
				title: "hello",
				content: "",
				doFilter: true,
			};

			const error = ServerError.badRequest(
				POST_ERROR_MESSAGES.REQUIRE_CONTENT
			);
			jest.spyOn(postService, "createPost").mockRejectedValue(error);

      const result = await postController.handlePostCreate(invalidPostDto, mockReq);

			expect(result).toEqual({
        message: `${error.name}: ${error.message}`,
      });
	});

	describe("GET /post", () => {
		const mockReadPostsQueryDto = {};

		it("전체 게시물 조회 성공", async () => {
			const mockTotalPosts = 5;
			const mockPostHeaders = [];

			jest.spyOn(mockPostService, "findPostHeaders").mockResolvedValue(
				mockPostHeaders
			);
			jest.spyOn(mockPostService, "findPostTotal").mockResolvedValue(
				mockTotalPosts
			);

			expect(
				await postController.handlePostsRead(
					mockReadPostsQueryDto,
					mockReq
				)
			).toEqual({
				total: mockTotalPosts,
				postHeaders: mockPostHeaders,
			});
		});

		it("전체 게시물 조회 실패 시 에러를 반환한다.", async () => {
			const error = ServerError.badRequest("잘못된 입력입니다");

			jest.spyOn(mockPostService, "findPostHeaders").mockRejectedValue(
				error
			);
			jest.spyOn(mockPostService, "findPostTotal").mockRejectedValue(
				error
			);

			await expect(
				postController.handlePostsRead(mockReadPostsQueryDto, mockReq)
			).rejects.toThrow(error);
		});
	});
	describe("GET /post/:post_id", () => {
		const mockPostId = 1;

		it("개별 게시물 조회 성공", async () => {
			const mockEachPost = [];
			jest.spyOn(mockPostService, "findPost").mockResolvedValue(
				mockEachPost
			);

			expect(
				await postController.handlePostRead(mockPostId, mockReq)
			).toEqual({
				post: [],
			});
		});
		it("개별 게시물 조회 실패 시 에러를 반환한다.", async () => {
			const error = ServerError.badRequest("잘못된 입력입니다");
			jest.spyOn(mockPostService, "findPost").mockRejectedValue(error);

			await expect(
				postController.handlePostRead(mockPostId, mockReq)
			).rejects.toThrow(error);
		});
	});

	describe("PATCH /post/:post_id", () => {
		const mockPostId = 1;
		const updateBodyDto = {
			title: "title",
			content: "content",
			doFilter: true,
		};
		it("게시물 수정 성공", async () => {
			mockPostService.updatePost.mockResolvedValue([]);

      const result = await postController.handlePostUpdate(
        mockPostId,
        updateBodyDto,
        mockReq
      );

      expect(postService.updatePost).toHaveBeenCalledWith(mockPostId, {
        ...updateBodyDto,
        author_id: mockUserId,
      });
			expect(result).toEqual({
				message: "게시글 수정 success",
			});
		});
		it("게시물 수정 실패 시 에러를 반환한다.", async () => {
			const error = ServerError.badRequest("잘못된 입력입니다");
			jest.spyOn(mockPostService, "updatePost").mockRejectedValue(error);

      const result = await postController.handlePostUpdate(mockPostId, updateBodyDto, mockReq);
      console.log(result)
      expect(result).toEqual({
        message: `${error.name}: ${error.message}`
		  });
    });
	});
	describe("DELETE /post/:post_id", () => {
		const mockPostId = 1;
		it("게시물 삭제 성공", async () => {
			mockPostService.deletePost.mockResolvedValue([]);
			jest.spyOn(mockPostService, "deletePost").mockResolvedValue([]);

      const result = await postController.handlePostDelete(mockPostId, mockReq);
      
      expect(postService.deletePost).toHaveBeenCalledWith(mockPostId, mockUserId);
			expect(result).toEqual({
				message: "게시글 삭제 success",
			});
		});
		it("게시물 삭제 실패 시 에러를 반환한다.", async () => {
			const error = ServerError.badRequest("잘못된 입력입니다");
			jest.spyOn(mockPostService, "deletePost").mockRejectedValue(error);

      const result = await postController.handlePostDelete(mockPostId, mockReq);
      expect(result).toEqual({
        message: `${error.name}: ${error.message}`
		  });
		});
	});
});
});
