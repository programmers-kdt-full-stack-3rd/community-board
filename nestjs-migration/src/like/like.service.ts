import { Injectable } from '@nestjs/common';
import { CommentLikeRepository, LikeRepository } from './like.repository';
import { Like } from './entities/like.entity';
import { ServerError } from 'src/common/exceptions/server-error.exception';
import { CommentLike } from './entities/comment-like.entity';

@Injectable()
export class LikeService {
    constructor(
        private readonly likeRepository: LikeRepository,
        private readonly commentLikeRepository: CommentLikeRepository
) {}

    async createPostLike (postId, userId) {

        const newLike = Object.assign(new Like, {post: postId, user:userId});
        
        await this.likeRepository.save(newLike);
    }

    async deletePostLike (postId, userId) {

        const result = await this.likeRepository.delete({post: postId, user: userId});
        if (!result.affected) {
            throw ServerError.reference("게시글 좋아요 취소 실패")
        }
    }

    async createCommentLike (commentId, userId) {

        const newCommentLike = Object.assign(new CommentLike, {comment: commentId, user:userId});
        
        await this.commentLikeRepository.save(newCommentLike);
    }

    async deleteCommentLike (commentId, userId) {

        const result = await this.commentLikeRepository.delete({comment: commentId, user: userId});
        if (!result.affected) {
            throw ServerError.reference("댓글 좋아요 취소 실패")
        }
    }


}
