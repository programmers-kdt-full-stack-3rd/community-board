import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { RankService } from "./rank.service";
import { ServerError } from "src/common/exceptions/server-error.exception";
import { RANK_ERROR_MESSAGES } from "./constant/rank.constants";
import {
	TopActivitiesRes,
	TopCommentsRes,
	TopPostsRes,
} from "./dto/rank-results.dto";

@Controller("rank")
export class RankController {
	constructor(private readonly rankService: RankService) {}

	@Get("/posts")
	@HttpCode(HttpStatus.OK)
	async handleTopPosts(): Promise<TopPostsRes[]> {
		try {
			const results = await this.rankService.getTopPosts();
			return results;
		} catch (err) {
			throw ServerError.reference(
				RANK_ERROR_MESSAGES.GET_TOP_POSTS_ERROR
			);
		}
	}

	@Get("/comments")
	@HttpCode(HttpStatus.OK)
	async handleTopComments(): Promise<TopCommentsRes[]> {
		try {
			const results = await this.rankService.getTopComments();
			return results;
		} catch (err) {
			throw ServerError.reference(
				RANK_ERROR_MESSAGES.GET_TOP_COMMENTS_ERROR
			);
		}
	}

	@Get("/activities")
	@HttpCode(HttpStatus.OK)
	async handleTopActivators(): Promise<TopActivitiesRes[]> {
		try {
			const results = await this.rankService.getTopActivities();
			return results;
		} catch (err) {
			throw ServerError.reference(
				RANK_ERROR_MESSAGES.GET_TOP_ACTIVITIES_ERROR
			);
		}
	}
}
