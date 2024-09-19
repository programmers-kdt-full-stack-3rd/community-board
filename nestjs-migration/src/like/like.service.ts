import { Injectable } from '@nestjs/common';
import { LikeRepository } from './like.repository';
import { Like } from './entities/like.entity';
import { ServerError } from 'src/common/exceptions/server-error.exception';

@Injectable()
export class LikeService {
    constructor(
        private readonly likeRepository: LikeRepository
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

}
