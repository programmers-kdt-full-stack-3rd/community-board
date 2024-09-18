import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Req,
	UseGuards,
	HttpCode,
	HttpStatus,
	Query,
	ParseIntPipe,
} from "@nestjs/common";
import { PostService } from "./post.service";
import { CreatePostBodyDto } from "./dto/create-post.dto";
import { UpdatePostBodyDto } from "./dto/update-post.dto";
import { LoginGuard } from "../common/guard/login.guard";
import { Request } from "express";
import { ReadPostsQueryDto } from "./dto/read-posts-query.dto";

@Controller("post")
export class PostController {
	constructor(private readonly postService: PostService) {}

	@UseGuards(LoginGuard)
	@Post("/")
	@HttpCode(HttpStatus.CREATED)
	async handlePostCreate(
		@Body() createPostBodyDto: CreatePostBodyDto,
		@Req() req: Request
	) {
		const authorId = req.user["userId"];
		const values = {
			...createPostBodyDto,
			authorId,
		};
		
		try {
			const postId = await this.postService.createPost(values);
			return { postId, message: "게시글 생성 success" };

		} catch (err) {
			return {  "message": `${err.name}: ${err.message}`};
		}
	}

	@Get("/")
	@HttpCode(HttpStatus.OK)
	async handlePostsRead(
		@Query() readPostsQueryDto: ReadPostsQueryDto,
		@Req() req: Request
	) {
    
		const userId = req.user? req.user["userId"] : 0;

		try {
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
		};
	};

	@Get("/:postId")
	@HttpCode(HttpStatus.OK)
	async handlePostRead(
		@Param("postId", ParseIntPipe) postId: number,
		@Req() req: Request
	) {
    	const userId = req.user? req.user["userId"] : 0;
		try{
			const post = await this.postService.findPost(postId, userId);
			return { post };
	
		} catch(err) {
			throw err;
		};
	};

	@UseGuards(LoginGuard)
	@Patch("/:postId")
	@HttpCode(HttpStatus.OK)
	async handlePostUpdate(
		@Param("postId", ParseIntPipe) postId: number,
		@Body() updatePostBodyDto: UpdatePostBodyDto,
		@Req() req: Request
	) {
		const authorId = req.user["userId"];
		const updateBodyDto = {
			...updatePostBodyDto,
			authorId,
		};

		try {
			await this.postService.updatePost(postId, updateBodyDto);
			return {  "message": "게시글 수정 success" };
		} catch(err) {
			return {  "message": `${err.name}: ${err.message}`};
		};
	};

  	@UseGuards(LoginGuard)
	@Delete(":postId")
	@HttpCode(HttpStatus.OK)
	async handlePostDelete(
		@Param("postId", ParseIntPipe) postId: number,
		@Req() req: Request,
	) {
		
		const userId = req.user["userId"];
		try {
			await this.postService.deletePost( userId, postId );
			return {  message: "게시글 삭제 success" };
		} catch (err) {
			return {  "message": `${err.name}: ${err.message}`};
		};
	};
};
