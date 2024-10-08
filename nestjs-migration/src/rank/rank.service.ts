import { Injectable } from "@nestjs/common";
import { CommentRepository } from "src/comment/comment.repository";
import { PostRepository } from "src/post/post.repository";
import { UserRepository } from "src/user/user.repository";
import {
	TopActivitiesRes,
	TopCommentsRes,
	TopPostsRes,
} from "./dto/rank-results.dto";

//try-catch
@Injectable()
export class RankService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly postRepository: PostRepository,
		private readonly commentRepository: CommentRepository
	) {}

	async getTopPosts(): Promise<TopPostsRes[]> {
		const result = await this.postRepository.getTopPosts();

		return result;
	}
	async getTopComments(): Promise<TopCommentsRes[]> {
		const result = await this.commentRepository.getTopComments();
		return result;
	}

	async getTopActivities(): Promise<TopActivitiesRes[]> {
		const result = await this.userRepository.getTopUserActivities();

		return result;
	}
}
