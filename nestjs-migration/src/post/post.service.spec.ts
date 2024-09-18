import { Test, TestingModule } from "@nestjs/testing";
import { PostService } from "./post.service";
import { PostRepository } from "./post.repository";
import { CreatePostDto } from "./dto/create-post.dto";
import { UserRepository } from "../user/user.repository";
import { LogRepository } from "../log/log.repository";
import { DataSource } from "typeorm";
import { Post } from "./entities/post.entity";
import { UpdatePostDto } from "./dto/update-post.dto";
import { User } from "../user/entities/user.entity";
import { ServerError } from "../common/exceptions/server-error.exception";

describe("PostService", () => {
	let postService: PostService;
	let postRepository: PostRepository;
	let userRepository: UserRepository;
	let logRepository: LogRepository;
	let dataSource: DataSource;
	let mockQueryRunner: any;

	const mockPostRepository = {
		getPostHeaders: jest.fn(),
		getPostTotal: jest.fn(),
		getPostHeader: jest.fn(),
		updatePost: jest.fn(),
		delete: jest.fn(),
		save: jest.fn(),
		update: jest.fn(),
		findOne: jest.fn(),
	};
	const mockUserRepository = {
		findOne: jest.fn(),
	};
	const mockDataSource = {
		createQueryRunner: jest.fn(),
	};
	const mockLogRepository = {
		save: jest.fn(),
	};

	let mockUserId: number;
	let mockUser: Partial<User>;
	let mockPostId: number;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				PostService,
				{
					provide: PostRepository,
					useValue: mockPostRepository,
				},
				{
					provide: UserRepository,
					useValue: mockUserRepository,
				},
				{
					provide: LogRepository,
					useValue: mockLogRepository,
				},
				{
					provide: DataSource,
					useValue: mockDataSource,
				},
			],
		}).compile();

		postService = module.get<PostService>(PostService);
		postRepository = module.get<PostRepository>(PostRepository);
		userRepository = module.get<UserRepository>(UserRepository);
		dataSource = module.get<DataSource>(DataSource);
		logRepository = module.get<LogRepository>(LogRepository);

		mockUser = {
			id: 1,
		};
		mockUserId = mockUser.id;
		mockPostId = 2;
	});

	describe("createPost", () => {
		mockQueryRunner = {
			connect: jest.fn(),
			startTransaction: jest.fn(),
			commitTransaction: jest.fn(),
			rollbackTransaction: jest.fn(),
			release: jest.fn(),
			manager: {
				save: jest.fn(),
				getRepository: jest.fn().mockReturnValue({
					save: jest.fn(),
				}),
			},
		};
		mockDataSource.createQueryRunner.mockReturnValue(mockQueryRunner);

		const mockUser = { id: 1, name: "Author" };
		const mockPostId = 1;


    const mockCreatePostDto: CreatePostDto = {
      title: "title",
      content: "content",
      doFilter: false,
      authorId: mockUser.id,
    };
    it("게시물 생성 성공 시 postId를 반환한다.", async () => {
      jest.spyOn(mockUserRepository, "findOne").mockResolvedValue(
        mockUser
      );
      jest.spyOn(mockQueryRunner.manager, "save").mockResolvedValue({
        id: mockPostId,
      });

      const result = await postService.createPost(mockCreatePostDto);

      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toBe(mockPostId);
    });
    it("존재하지 않는 user일 시 에러를 반환한다.", async () => {
      jest.spyOn(mockUserRepository, "findOne").mockResolvedValue(
        null
      );

      await expect(
        postService.createPost(mockCreatePostDto)
      ).rejects.toThrow(
        ServerError.notFound("존재하지 않는 유저입니다")
      );
      expect(
        mockQueryRunner.rollbackTransaction
      ).not.toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it("게시물 생성 중 오류 발생 시 롤백된다.", async () => {
      const mockError = new Error("트랜잭션 중 에러 발생");
      jest.spyOn(mockUserRepository, "findOne").mockResolvedValue(
        mockUser
      );
      jest.spyOn(mockQueryRunner.manager, "save").mockRejectedValue(
        mockError
      );

      await expect(
        postService.createPost(mockCreatePostDto)
      ).rejects.toThrow(mockError);

      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });
	});

	describe("findPostHeaders", () => {
		const mockReadPostsQueryDto = {};
		it("게시물 전체 조회 성공 시 게시물들을 반환한다.", async () => {
			jest.spyOn(mockPostRepository, "getPostHeaders").mockResolvedValue(
				{}
			);

			const result = await postService.findPostHeaders(
				mockReadPostsQueryDto,
				mockUserId
			);

			expect(postRepository.getPostHeaders).toHaveBeenCalledWith(
				mockReadPostsQueryDto,
				mockUserId
			);
			expect(result).toEqual({});
		});
		it("게시물 헤더 조회 시 에러가 발생하면 에러를 반환한다.", async () => {
			const mockError = new Error("게시물 헤더 조회 중 오류 발생");

			mockPostRepository.getPostHeaders.mockRejectedValue(mockError);

			await expect(
				postService.findPostHeaders(mockReadPostsQueryDto, mockUserId)
			).rejects.toThrow(mockError);
		});
	});

	describe("findPostTotal", () => {
		const mockReadPostsQueryDto = {};
		it("게시물 개수 조회 성공 시 개수를 반환한다.", async () => {
			const mockTotal = 10;
			jest.spyOn(mockPostRepository, "getPostTotal").mockResolvedValue(
				mockTotal
			);

			const result = await postService.findPostTotal(
				mockReadPostsQueryDto,
				mockUserId
			);

			expect(postRepository.getPostHeaders).toHaveBeenCalledWith(
				mockReadPostsQueryDto,
				mockUserId
			);
			expect(result).toEqual(mockTotal);
		});
		it("게시물 개수 조회 도중 에러 발생 시 에러를 반환한다.", async () => {
			const mockError = new Error("게시물 개수 조회 중 오류 발생");
			jest.spyOn(mockPostRepository, "getPostTotal").mockRejectedValue(
				mockError
			);

			await expect(
				postService.findPostTotal(mockReadPostsQueryDto, mockUserId)
			).rejects.toThrow(mockError);
		});
	});

	describe("findPost", () => {
		it("게시물 상세 조회 성공 시 게시물을 반환한다.", async () => {
			const mockPost = {id:1, title: "title", content: "content"}
			jest.spyOn(mockPostRepository, "getPostHeader").mockResolvedValue(mockPost);
			const result = await postService.findPost(mockPostId, mockUserId);

			expect(postRepository.getPostHeader).toHaveBeenCalledWith(
				mockPostId,
				mockUserId
			);
			expect(result).toEqual(mockPost);
		});
		it("게시물 상세 조회 중 에러 발생 시 에러를 반환한다", async () => {
			const mockError = new Error("게시물 상세 조회 중 오류 발생");
			jest.spyOn(mockPostRepository, "getPostHeader").mockRejectedValue(
				mockError
			);

			await expect(
				postService.findPost(mockPostId, mockUserId)
			).rejects.toThrow(mockError);
		});
	});

	describe("updatePost", () => {
		let mockUpdateDto: UpdatePostDto;
		beforeEach(() => {
			jest.clearAllMocks();
			mockUpdateDto = {
				title: "New Title",
				content: "New Content",
				authorId: mockUserId,
				doFilter: true,
			};
		});
		it("게시물 업데이트 성공", async () => {
			jest.spyOn(mockUserRepository, "findOne").mockResolvedValue(
				mockUserId
			);
			jest.spyOn(mockPostRepository, "findOne").mockResolvedValue(
				mockPostId
			);
			jest.spyOn(mockPostRepository, "update").mockResolvedValue({
				affected: 1,
			});

			const result = await postService.updatePost(
				mockPostId,
				mockUpdateDto
			);
			expect(userRepository.findOne).toHaveBeenCalledWith({
				where: { id: mockUserId },
			});
			expect(postRepository.findOne).toHaveBeenCalledWith({
				where: { id: mockPostId },
			});
			expect(postRepository.update).toHaveBeenCalledWith(
				{ id: mockPostId },
				{ title: "New Title", content: "New Content" }
			);
			expect(result).toEqual(true);
		});

		it("존재하지 않는 user 시 에러를 반환한다", async () => {
			jest.spyOn(mockUserRepository, "findOne").mockResolvedValue(null);

			await expect(
				postService.updatePost(mockPostId, mockUpdateDto)
			).rejects.toThrow(ServerError.notFound("없는 유저이거나 존재하지 않는 게시물입니다."));

			expect(postRepository.update).not.toHaveBeenCalled();
		});
		it("존재하지 않는 post 시 에러를 반환한다", async () => {
			jest.spyOn(mockPostRepository, "findOne").mockResolvedValue(null);
			await expect(
				postService.updatePost(mockPostId, mockUpdateDto)
			).rejects.toThrow(ServerError.notFound("없는 유저이거나 존재하지 않는 게시물입니다."));

			expect(postRepository.update).not.toHaveBeenCalled();
		});
	});
	describe("deletePost", () => {
		beforeEach(() => {
			jest.clearAllMocks();
		});
		it("게시물 삭제 성공", async () => {
			jest.spyOn(mockPostRepository, "findOne").mockResolvedValue(
				mockPostId
			);
			jest.spyOn(mockPostRepository, "delete").mockResolvedValue({
				affected: 1,
			});

			const result = await postService.deletePost(mockUserId, mockPostId);

			expect(postRepository.findOne).toHaveBeenCalledWith({
				where: { id: mockPostId },
			});
			expect(postRepository.update).toHaveBeenCalledWith(
				{ id: mockPostId, isDelete: 0, author: mockUserId },
				{ isDelete: 1 }
			);
			expect(result).toEqual(true);
		});
		it("이미 삭제된 게시물일 시 에러를 반환한다", async () => {
			const mockDeletedPost = {
				id: mockPostId,
				isDelete: 1,
				author: { id: mockUserId },
			};

			jest.spyOn(mockPostRepository, "findOne").mockResolvedValue(
				mockDeletedPost
			);

			await expect(
				postService.deletePost(mockPostId, mockUserId)
			).rejects.toThrow(ServerError.reference("게시글 삭제 실패"));

			expect(postRepository.update).not.toHaveBeenCalled();
		});
	});
});
