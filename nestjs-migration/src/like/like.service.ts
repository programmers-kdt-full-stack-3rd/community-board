import { Injectable } from "@nestjs/common";
import { CommentLikeRepository, LikeRepository } from "./like.repository";
import { Like } from "./entities/like.entity";
import { ServerError } from "../common/exceptions/server-error.exception";
import { CommentLike } from "./entities/comment-like.entity";
import { HandleLikeDto } from "./dto/handle-like-dto";
import { HandleCommentLikeDto } from "./dto/handle-comment-like-dto";
import { LIKE_ERROR_MESSAGES } from "./constant/like.constants";

@Injectable()
export class LikeService {
	constructor(
		private readonly likeRepository: LikeRepository,
		private readonly commentLikeRepository: CommentLikeRepository
	) {}

	async createPostLike(createPostLikeDto: HandleLikeDto): Promise<void> {
		const { postId, userId } = createPostLikeDto;

		const newLike = Object.assign(new Like(), {
			post: postId,
			user: userId,
		});

		await this.likeRepository.save(newLike);
	}

	async deletePostLike(deletePostLikeDto: HandleLikeDto): Promise<void> {
		const { postId, userId } = deletePostLikeDto;

		const result = await this.likeRepository.delete({
			post: { id: postId },
			user: { id: userId },
		});
		if (!result.affected) {
			throw ServerError.reference(
				LIKE_ERROR_MESSAGES.DELETE_POST_LIKE_ERROR
			);
		}
	}

	async createCommentLike(
		createCommentLikeDto: HandleCommentLikeDto
	): Promise<void> {
		const { commentId, userId } = createCommentLikeDto;
		const newCommentLike = Object.assign(new CommentLike(), {
			comment: commentId,
			user: userId,
		});

		await this.commentLikeRepository.save(newCommentLike);
	}

	async deleteCommentLike(
		deleteCommentLikeDto: HandleCommentLikeDto
	): Promise<void> {
		const { commentId, userId } = deleteCommentLikeDto;
		const result = await this.commentLikeRepository.delete({
			comment: { id: commentId },
			user: { id: userId },
		});
		if (!result.affected) {
			throw ServerError.reference(
				LIKE_ERROR_MESSAGES.DELETE_COMMENT_LIKE_ERROR
			);
		}
	}
}
