import { Injectable } from "@nestjs/common";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { DataSource } from "typeorm";
import { changeBadWords, getRegex } from "../utils/bad-word-regex/regexTask";
import { regexs } from "../utils/bad-word-regex/regexs.json";
import { makeLogTitle } from "../utils/user-logs-utils";
import { Post } from "./entities/post.entity";
import { ReadPostsQuery } from "./dto/read-posts-query.dto";
import { PostRepository } from "./post.repository";
import { Log } from "../log/entities/log.entity";
import { ServerError } from "../common/exceptions/server-error.exception";
import { GetPostHeadersDto } from "./dto/get-post-headers.dto";
import { DeletePostDto } from "./dto/delete-post.dto";
import { POST_ERROR_MESSAGES } from "./constant/post.constants";
import { GetPostDto } from "./dto/get-post.dto";

@Injectable()
export class PostService {
	constructor(
		private dataSource: DataSource,
		private postRepository: PostRepository
	) {}

	async createPost(createPostDto: CreatePostDto): Promise<number> {
		const queryRunner = this.dataSource.createQueryRunner();
		let isTransactionStarted = false;

		try {
			let { doFilter, content, category_id, title, authorId } =
				createPostDto;

			if (doFilter) {
				const regex = getRegex(regexs);
				const newText = changeBadWords(content, regex);
				content = newText;
			}

			const newPost = Object.assign(new Post(), {
				title,
				content,
				category: category_id,
				author: authorId,
			});
			const logTitle = makeLogTitle(title);
			const logValue = Object.assign(new Log(), {
				userId: authorId,
				title: logTitle,
				categoryId: 1,
			});

			//트랜잭션
			await queryRunner.connect();
			await queryRunner.startTransaction();
			isTransactionStarted = true;

			const result = await queryRunner.manager.save(newPost);
			const postId = result.id;
			await queryRunner.manager.getRepository(Log).save(logValue);

			await queryRunner.commitTransaction();

			return postId;
		} catch (err) {
			if (isTransactionStarted) {
				await queryRunner.rollbackTransaction();
			}
			throw err;
		} finally {
			await queryRunner.release();
		}
	}

	async findPostHeaders(
		readPostsQuery: ReadPostsQuery,
		userId: number
	): Promise<GetPostHeadersDto[]> {
		const postHeaders = await this.postRepository.getPostHeaders(
			readPostsQuery,
			userId
		);

		return postHeaders;
	}

	async findPostTotal(
		readPostsQueryDto: ReadPostsQuery,
		userId: number
	): Promise<number> {
		const total = await this.postRepository.getPostTotal(
			readPostsQueryDto,
			userId
		);

		return total;
	}

	async findPost(postId: number, userId: number): Promise<GetPostDto> {
		const post = await this.postRepository.getPost(postId, userId);

		if (!post) {
			throw ServerError.notFound(POST_ERROR_MESSAGES.NOT_FOUND_POST);
		} else {
			return post;
		}
	}

	async updatePost(
		postId: number,
		updatePostDto: UpdatePostDto
	): Promise<boolean> {
		let { doFilter, content, title, authorId } = updatePostDto;

		if (content && doFilter) {
			const regex = getRegex(regexs);
			content = changeBadWords(content, regex);
		}

		let result;
		if (content && title) {
			result = await this.postRepository.update(
				{ id: postId, author: { id: authorId } },
				{ title, content }
			);
		} else if (title) {
			result = await this.postRepository.update(
				{ id: postId, author: { id: authorId } },
				{ title }
			);
		} else if (content) {
			result = await this.postRepository.update(
				{ id: postId, author: { id: authorId } },
				{ content }
			);
		}

		//TODO: 같은 내용 update해도 affected = 1 _express와 동일
		//WHERE문 추가로 affected=0으로 할 수는있음
		if (result && result.affected) {
			return true;
		} else {
			throw ServerError.reference(POST_ERROR_MESSAGES.UPDATE_POST_ERROR);
		}
	}

	async deletePost(deletePostDto: DeletePostDto): Promise<boolean> {
		const { postId, authorId } = deletePostDto;

		const result = await this.postRepository.update(
			{ id: postId, isDelete: false, author: { id: authorId } },
			{ isDelete: true }
		);

		if (result.affected) {
			return true;
		} else {
			throw ServerError.reference(POST_ERROR_MESSAGES.DELETE_POST_ERROR);
		}
	}
}
