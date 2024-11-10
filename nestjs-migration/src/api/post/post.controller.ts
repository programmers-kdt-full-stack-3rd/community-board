import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
	UseGuards,
} from "@nestjs/common";
import { User } from "src/common/decorator/user.decorator";
import { IUserEntity } from "src/common/interface/user-entity.interface";
import { Permissions } from "../../common/decorator/rbac.decorator";
import { LoginGuard } from "../../common/guard/login.guard";
import { CreatePostReq } from "./dto/create-post.dto";
import {
	CreatePostRes,
	DeletePostRes,
	GetPostRes,
	GetPostsHeaderRes,
	UpdatePostRes,
} from "./dto/post-results.dto";
import { ReadPostsQuery } from "./dto/read-posts-query.dto";
import { UpdatePostReq } from "./dto/update-post.dto";
import { PostService } from "./post.service";

@Controller("post")
export class PostController {
	constructor(private readonly postService: PostService) {}

	@UseGuards(LoginGuard)
	@Post("/")
	@HttpCode(HttpStatus.OK)
	@Permissions("create:post")
	async handlePostCreate(
		@Body() createPostReq: CreatePostReq,
		@User() user: IUserEntity
	): Promise<CreatePostRes> {
		try {
			const authorId = user.userId;
			const createPostDto = {
				...createPostReq,
				authorId,
			};
			const postId = await this.postService.createPost(createPostDto);
			return { postId, message: "게시글 생성 success" };
		} catch (err) {
			throw err;
		}
	}

	@Get("/")
	@HttpCode(HttpStatus.OK)
	@Permissions("read:post")
	async handlePostsRead(
		@Query() readPostsQuery: ReadPostsQuery,
		@User() user: IUserEntity
	): Promise<GetPostsHeaderRes> {
		try {
			const userId = user ? user.userId : 0;
			const postHeaders = await this.postService.findPostHeaders(
				readPostsQuery,
				userId
			);
			const total = await this.postService.findPostTotal(
				readPostsQuery,
				userId
			);
			return { total, postHeaders };
		} catch (err) {
			throw err;
		}
	}

	@Get("/:postId")
	@HttpCode(HttpStatus.OK)
	@Permissions("read:post")
	async handlePostRead(
		@Param("postId", ParseIntPipe) postId: number,
		@User() user: IUserEntity
	): Promise<GetPostRes> {
		try {
			const userId = user ? user.userId : 0;
			const post = await this.postService.findPost(postId, userId);
			return { post };
		} catch (err) {
			throw err;
		}
	}

	@UseGuards(LoginGuard)
	@Patch("/:postId")
	@HttpCode(HttpStatus.OK)
	@Permissions("update:post")
	async handlePostUpdate(
		@Param("postId", ParseIntPipe) postId: number,
		@Body() updatePostReq: UpdatePostReq,
		@User() user: IUserEntity
	): Promise<UpdatePostRes> {
		try {
			const authorId = user.userId;
			const updateBodyDto = {
				...updatePostReq,
				authorId,
			};
			await this.postService.updatePost(postId, updateBodyDto);
			return { message: "게시글 수정 success" };
		} catch (err) {
			throw err;
		}
	}

	@UseGuards(LoginGuard)
	@Delete(":postId")
	@HttpCode(HttpStatus.OK)
	@Permissions("delete:post")
	async handlePostDelete(
		@Param("postId", ParseIntPipe) postId: number,
		@User() user: IUserEntity
	): Promise<DeletePostRes> {
		try {
			const userId = user.userId;
			const deletePostDto = {
				postId,
				authorId: userId,
			};
			await this.postService.deletePost(deletePostDto);
			return { message: "게시글 삭제 success" };
		} catch (err) {
			throw err;
		}
	}
}
