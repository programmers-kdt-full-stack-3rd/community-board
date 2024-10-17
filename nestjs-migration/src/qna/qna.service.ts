import { Injectable } from "@nestjs/common";

import { AcceptQnACommentReq } from "./dto/create-qna.dto";
import { GetQnAAcceptInfoReq, GetQnAAcceptInfoRes } from "./dto/get-qna.dto";
import { QnARepository } from "./qna.repository";

import { Comment } from "../comment/entities/comment.entity";
import { Post } from "../post/entities/post.entity";
import { ServerError } from "src/common/exceptions/server-error.exception";

@Injectable()
export class QnAService {
	constructor(private qnaRepository: QnARepository) {}

	// QnA 댓글 채택 정보
	async getQnAAcceptInfo({
		postIds,
	}: GetQnAAcceptInfoReq): Promise<GetQnAAcceptInfoRes> {
		const result = await Promise.all(
			postIds.map(async postId => {
				const qna = await this.qnaRepository.findByPostId(postId);
				return qna ? qna.comment.id : null;
			})
		);

		return { commentIds: result };
	}

	// QnA 댓글 채택
	async acceptQnAComment({
		postId,
		commentId,
	}: AcceptQnACommentReq): Promise<void> {
		const post = await this.qnaRepository.manager.findOne(Post, {
			where: { id: postId },
		});

		if (!post) {
			throw ServerError.badRequest(
				`Post ID(${postId})가 존재하지 않습니다.`
			);
		}

		const comment = await this.qnaRepository.manager.findOne(Comment, {
			where: { id: commentId },
		});

		if (!comment) {
			throw ServerError.badRequest(
				`Comment ID(${commentId})가 존재하지 않습니다.`
			);
		}

		await this.qnaRepository.save({
			post,
			comment,
		});
	}
}
