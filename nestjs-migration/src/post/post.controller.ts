import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	HttpCode,
	HttpStatus,
	Query,
	ParseIntPipe,
} from "@nestjs/common";
import { PostService } from "./post.service";
import { ReadPostsQuery } from "./dto/read-posts-query.dto";
import { CreatePostReq } from "./dto/create-post.dto";
import { UpdatePostReq } from "./dto/update-post.dto";
import { LoginGuard } from "../common/guard/login.guard";
import { User } from "src/common/decorator/user.decorator";
import { IUserEntity } from "src/common/interface/user-entity.interface";
import {
	CreatePostRes,
	DeletePostRes,
	GetPostRes,
	GetPostsHeaderRes,
	UpdatePostRes,
} from "./dto/post-results.dto";

@Controller("post")
export class PostController {
	constructor(private readonly postService: PostService) {}

	@UseGuards(LoginGuard)
	@Post("/")
	@HttpCode(HttpStatus.OK)
	async handlePostCreate(
		@Body() createPostBodyDto: CreatePostReq,
		@User() user: IUserEntity
	): Promise<CreatePostRes> {
		try {
			const authorId = user.userId;
			const createPostDto = {
				...createPostBodyDto,
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
	async handlePostsRead(
		@Query() readPostsQueryDto: ReadPostsQuery,
		@User() user: IUserEntity
	): Promise<GetPostsHeaderRes> {
		try {
			const userId = user ? user.userId : 0;
			const postHeaders = await this.postService.findPostHeaders(
				readPostsQueryDto,
				userId
			);
			const total = await this.postService.findPostTotal(
				readPostsQueryDto,
				userId
			);
			return { total, postHeaders };
		} catch (err) {
			throw err;
		}
	}

	@Get("/:postId")
	@HttpCode(HttpStatus.OK)
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
	async handlePostUpdate(
		@Param("postId", ParseIntPipe) postId: number,
		@Body() updatePostBodyDto: UpdatePostReq,
		@User() user: IUserEntity
	): Promise<UpdatePostRes> {
		try {
			const authorId = user.userId;
			const updateBodyDto = {
				...updatePostBodyDto,
				authorId,
			};
			await this.postService.updatePost(postId, updateBodyDto);
			return { message: "게시글 수정 success" };
		} catch (err) {
			throw err;
		}
	}

	//?userID: admin때문인 것 같은데..
	@UseGuards(LoginGuard)
	@Delete(":postId")
	@HttpCode(HttpStatus.OK)
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
