import { Test, TestingModule } from "@nestjs/testing";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import {  CreatePostDto } from "./dto/create-post.dto";
import { ServerError } from "../common/exceptions/server-error.exception";
import { POST_ERROR_MESSAGES } from "./constant/post.constants";
import { ReadPostsQueryDto } from "./dto/read-posts-query.dto";

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
	mockUserId = 1;
	mockPostId = 9;
	mockReq = {
		user: { userId: mockUserId },
	} as any;

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
	});

	describe("POST /post", () => {
		const mockCreatePostDto: CreatePostDto = {
			title: "Test Title",
			content: "Test Content",
     		authorId: mockUserId,
			doFilter: true,
		};

		it("게시물 생성 성공", async () => {
			mockPostService.createPost.mockResolvedValue(
				mockPostId
			);
			
			const result = await postController.handlePostCreate(
				mockCreatePostDto,
				mockReq
			);

			expect(postService.createPost).toHaveBeenCalledWith(
				{...mockCreatePostDto, authorId: mockUserId}
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
			mockPostService.createPost.mockRejectedValue(error);

			await expect(postController.handlePostCreate(invalidPostDto, mockReq)).rejects.toThrow(error);
		});
	});

	describe("GET /post", () => {
		const mockReadPostsQueryDto: ReadPostsQueryDto = {};

		it("전체 게시물 조회 성공", async () => {
			const mockTotalPosts = 5;
			const mockPostHeaders = [
						{
								"id": 32,
								"title": "finally",
								"author_nickname": "moon",
								"created_at": "2024-09-18T17:46:59.000Z",
								"views": 0,
								"likes": "0"
						}
			];
			
			mockPostService.findPostHeaders.mockResolvedValue(mockPostHeaders);
			mockPostService.findPostTotal.mockResolvedValue(mockTotalPosts);

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

			mockPostService.findPostHeaders.mockRejectedValue(error);
			mockPostService.findPostTotal.mockRejectedValue(error);

			await expect(
				postController.handlePostsRead(mockReadPostsQueryDto, mockReq)
			).rejects.toThrow(error);
		});
	});

	describe("GET /post/:post_id", () => {

		it("개별 게시물 조회 성공", async () => {
			const mockEachPost =  {
						"id": 17,
						"title": "5번째 게시물",
						"content": "게시물 내용을 입력",
						"author_id": 1,
						"author_nickname": "moon",
						"is_author": 0,
						"created_at": "2024-09-18T02:00:07.000Z",
						"updated_at": null,
						"views": 0,
						"user_liked": 0,
						"likes": "3"
				};

			mockPostService.findPost.mockResolvedValue(mockEachPost);

			expect(
				await postController.handlePostRead(mockPostId, mockReq)
			).toEqual({
				post: mockEachPost,
			});
		});
		
		it("개별 게시물 조회 실패 시 에러를 반환한다.", async () => {
			const error = ServerError.badRequest("잘못된 입력입니다");
			mockPostService.findPost.mockRejectedValue(error);

			await expect(
				postController.handlePostRead(mockPostId, mockReq)
			).rejects.toThrow(error);
		});
	});

	describe("PATCH /post/:post_id", () => {
		const updateBodyDto = {
			title: "title",
			content: "content",
			doFilter: true,
		};
		it("게시물 수정 성공", async () => {
			mockPostService.updatePost.mockResolvedValue(undefined);

			const result = await postController.handlePostUpdate(
				mockPostId,
				updateBodyDto,
				mockReq
			);

			expect(postService.updatePost).toHaveBeenCalledWith(mockPostId, {
				...updateBodyDto,
				authorId: mockUserId,
			});
			expect(result).toEqual({
				message: "게시글 수정 success",
			});
		});
		it("게시물 수정 실패 시 에러를 반환한다.", async () => {
			const error = ServerError.badRequest("잘못된 입력입니다");
			mockPostService.updatePost.mockRejectedValue(error);

			await expect(postController.handlePostUpdate(mockPostId, updateBodyDto, mockReq)).rejects.toThrow(error);
    	});
	});

	describe("DELETE /post/:post_id", () => {
		const deletePostDto = {
			authorId: mockUserId,
			postId: mockPostId
		}
		it("게시물 삭제 성공", async () => {
			mockPostService.deletePost.mockResolvedValue(undefined);
			const result = await postController.handlePostDelete(mockPostId, mockReq);

			expect(postService.deletePost).toHaveBeenCalledWith(deletePostDto);
			expect(result).toEqual({
				message: "게시글 삭제 success",
			});
		});

		it("게시물 삭제 실패 시 에러를 반환한다.", async () => {
			const error = ServerError.badRequest("잘못된 입력입니다");
			mockPostService.deletePost.mockRejectedValue(error);

			await expect(postController.handlePostDelete(mockPostId, mockReq)).rejects.toThrow(error);
		});
	});
});
