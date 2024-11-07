import { Injectable } from "@nestjs/common";
import { mapStatsToResponse } from "shared";
import { CommentRepository } from "../comment/comment.repository";
import { ServerError } from "../../common/exceptions/server-error.exception";
import { PostRepository } from "../post/post.repository";
import { UserRepository } from "../user/user.repository";
import { UserService } from "../user/user.service";
import { GetPostsDto } from "./dto/get-posts.dto";
import { GetStatsQueryDto } from "./dto/get-stats.dto";
import { GetUsersDto } from "./dto/get-users.dto";

@Injectable()
export class AdminService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly userService: UserService,
		private readonly postRepository: PostRepository,
		private readonly commentRepository: CommentRepository
	) {}

	async getUsers(getUsersDto: GetUsersDto) {
		getUsersDto.index -= 1;
		if (getUsersDto.index < 0) {
			getUsersDto.index = 0;
		}
		if (getUsersDto.perPage < 0) {
			getUsersDto.perPage = 10;
		}

		const result = await this.userRepository.getUserInfo(getUsersDto);

		return result;
	}

	async deleteUser(userId: number) {
		await this.userService.deleteUser(userId);
	}

	async restoreUser(userId: number) {
		const result = await this.userRepository.restoreUser(userId);

		if (result.affected === 0) {
			throw ServerError.badRequest("회원 복구 실패");
		}
	}

	async getPosts(getPostsDto: GetPostsDto) {
		getPostsDto.index -= 1;
		if (getPostsDto.index < 0) {
			getPostsDto.index = 0;
		}

		if (getPostsDto.perPage < 0) {
			getPostsDto.perPage = 10;
		}

		const result = await this.postRepository.getAdminPosts(getPostsDto);

		if (result.postHeaders.length === 0) {
			throw ServerError.notFound("게시글이 존재하지 않습니다.");
		}

		return result;
	}

	async deletePost(postId: number) {
		const result = await this.postRepository.update(
			{ id: postId, isDelete: false },
			{ isDelete: true }
		);

		if (result.affected === 0) {
			throw ServerError.badRequest("게시글 삭제 실패");
		}
	}

	async restorePost(postId: number) {
		const result = await this.postRepository.update(
			{ id: postId, isDelete: true },
			{ isDelete: false }
		);

		if (result.affected === 0) {
			throw ServerError.badRequest("게시글 복구 실패");
		}
	}

	async publicPost(postId: number) {
		const result = await this.postRepository.update(
			{ id: postId, isPrivate: true },
			{ isPrivate: false }
		);

		if (result.affected === 0) {
			throw ServerError.badRequest("게시글 공개 실패");
		}
	}

	async privatePost(postId: number) {
		const result = await this.postRepository.update(
			{ id: postId, isPrivate: false },
			{ isPrivate: true }
		);

		if (result.affected === 0) {
			throw ServerError.badRequest("게시글 비공개 실패");
		}
	}

	async getStats(getStatsQueryDto: GetStatsQueryDto) {
		const totalStats = await this.getTotalStats();
		const intervalStats = await this.getIntervalStats(getStatsQueryDto);

		return mapStatsToResponse(totalStats, intervalStats);
	}

	private async getTotalStats() {
		const postResult = await this.postRepository.getPostStats();
		const commentCount = await this.commentRepository.countActiveComments();
		const userCount = await this.userRepository.countActiveUsers();

		return {
			posts: postResult.count,
			views: postResult.views,
			comments: commentCount,
			users: userCount,
		};
	}

	private async getIntervalStats(getStatsQueryDto: GetStatsQueryDto) {
		const { startDate, endDate, interval } = getStatsQueryDto;
		let dateFormat: string;
		let start: Date = null;
		let end: Date = null;

		switch (interval) {
			case "daily":
				dateFormat = "%Y-%m-%d";
				break;
			case "monthly":
				dateFormat = "%Y-%m";
				break;
			case "yearly":
				dateFormat = "%Y";
				break;
			default:
				throw ServerError.badRequest("잘못된 interval 값입니다.");
		}

		if (startDate) {
			start = new Date(startDate);
		}

		if (endDate) {
			end = new Date(endDate);
			end.setDate(end.getDate() + 1);
			end.setSeconds(end.getSeconds() - 1);
		}

		const posts = await this.postRepository.getIntervalStats(
			dateFormat,
			start,
			end
		);
		const comments = await this.commentRepository.getIntervalStats(
			dateFormat,
			start,
			end
		);
		const users = await this.userRepository.getIntervalStats(
			dateFormat,
			start,
			end
		);

		return { posts, comments, users };
	}

	async getUserStat(userId: number) {
		const user = await this.userRepository.findOne({
			where: { id: userId },
		});
		if (!user) {
			throw ServerError.badRequest("존재 하지 않는 사용자입니다.");
		}

		const postCount = await this.postRepository.getPostStatByUser(userId);
		const commentCount =
			await this.commentRepository.getCommentStatByUser(userId);

		return {
			nickname: user.nickname,
			stats: {
				posts: postCount.count,
				views: postCount.views,
				comments: commentCount.count,
			},
		};
	}
}
