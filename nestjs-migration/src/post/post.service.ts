import { Injectable } from "@nestjs/common";
import { Room } from "src/chat/entities/room.entity";
import { DataSource } from "typeorm";
import { ServerError } from "../common/exceptions/server-error.exception";
import { Log } from "../log/entities/log.entity";
import { changeBadWords, getRegex } from "../utils/bad-word-regex/regexTask";
import { regexs } from "../utils/bad-word-regex/regexs.json";
import { makeLogTitle } from "../utils/user-logs-utils";
import { POST_ERROR_MESSAGES } from "./constant/post.constants";
import { CreatePostDto } from "./dto/create-post.dto";
import { DeletePostDto } from "./dto/delete-post.dto";
import { GetPostHeadersDto } from "./dto/get-post-headers.dto";
import { GetPostDto } from "./dto/get-post.dto";
import { ReadPostsQuery } from "./dto/read-posts-query.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { Post } from "./entities/post.entity";
import { RecrutingPost } from "./entities/recruting_posts.entity";
import { PostRepository } from "./post.repository";

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
			const { doFilter, category_id, title, authorId, room_id } =
				createPostDto;
			let { content } = createPostDto;

			if (doFilter) {
				const regex = getRegex(regexs);
				const newText = changeBadWords(content, regex);
				content = newText;
			}

			if (category_id === 5) {
				if (!this.checkTemplate(content)) {
					throw ServerError.badRequest(
						POST_ERROR_MESSAGES.INVALID_TEMPLATE
					);
				}
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

			if (room_id) {
				const room = await queryRunner.manager
					.getRepository(Room)
					.findOne({ where: { id: room_id } });

				// TODO : recruting_posts 테이블에 post_id, room_id insert
				const recrutingPost = Object.assign(new RecrutingPost(), {
					post: newPost, // post 객체 할당
					room: room, // room 객체 할당
				});

				await queryRunner.manager
					.getRepository(RecrutingPost)
					.save(recrutingPost);
			}

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
			//조회수 증가
			if (!post.is_author) {
				await this.addView(post.id);
				post.views += 1;
			}
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

		if ((await this.getCategoryIdByPostId(postId)) === 5) {
			if (!this.checkTemplate(content)) {
				throw ServerError.badRequest(
					POST_ERROR_MESSAGES.INVALID_TEMPLATE
				);
			}
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

	private checkTemplate(content: string): boolean {
		const requiredSections = [
			'<p><strong class="ql-size-large">📝 </strong><strong class="ql-size-large ql-color-red3">[버그/이슈] </strong><strong class="ql-size-large">설명</strong></p>',
			'<p><strong class="ql-size-large">🔍 해결 단계</strong></p>',
			'<p><strong class="ql-size-large">💡 예상 결과</strong></p>',
			'<p><strong class="ql-size-large">💡 실제 결과</strong></p>',
			'<p><strong class="ql-size-large">🔗 추가 정보(참고 사항)</strong></p>',
			'<p><strong class="ql-size-large">📌 우선순위</strong></p>',
		];

		return requiredSections.every(section => content.includes(section));
	}

	private async getCategoryIdByPostId(postId: number): Promise<number> {
		const result = await this.postRepository.findOne({
			where: { id: postId },
			select: ["category"],
		});

		return result.category.id;
	}

	private async addView(postId: number): Promise<void> {
		const post = await this.postRepository.findOne({
			where: { id: postId },
		});
		post.views += 1;

		await this.postRepository.update(
			{ id: postId },
			{ views: post.views, updatedAt: post.updatedAt }
		);
	}
}
