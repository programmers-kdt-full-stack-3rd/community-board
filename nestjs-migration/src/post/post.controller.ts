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
import { CreatePostBodyDto, CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostBodyDto, UpdatePostDto } from "./dto/update-post.dto";
import { LoginGuard } from "../common/guard/login.guard";
import { Request, Response } from "express";
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
		const author_id = req.user["userId"];
		const values = {
			...createPostBodyDto,
			author_id,
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

	@Get("/:post_id")
	@HttpCode(HttpStatus.OK)
	async handlePostRead(
		@Param("post_id", ParseIntPipe) post_id: number,
		@Req() req: Request
	) {
    	const userId = req.user? req.user["userId"] : 0;
		try{
			const post = await this.postService.findPost(post_id, userId);
			return { post };
		} catch(err) {
			throw err;
		};
	};

	@UseGuards(LoginGuard)
	@Patch("/:post_id")
	@HttpCode(HttpStatus.OK)
	async handlePostUpdate(
		@Param("post_id", ParseIntPipe) post_id: number,
		@Body() updatePostBodyDto: UpdatePostBodyDto,
		@Req() req: Request
	) {
		const author_id = req.user["userId"];
		const updateBodyDto = {
			...updatePostBodyDto,
			author_id,
		};

		try {
			await this.postService.updatePost(post_id, updateBodyDto);
			return {  "message": "게시글 수정 success" };
		} catch(err) {
			return {  "message": `${err.name}: ${err.message}`};
		};
	};

  	@UseGuards(LoginGuard)
	@Delete(":post_id")
	@HttpCode(HttpStatus.OK)
	async handlePostDelete(
		@Param("post_id", ParseIntPipe) post_id: number,
		@Req() req: Request,
	) {
		
		const user_id = req.user["userId"];
		try {
			await this.postService.deletePost( user_id, post_id );
			return {  message: "게시글 삭제 success" };
		} catch (err) {
			return {  "message": `${err.name}: ${err.message}`};
		};
	};
};
