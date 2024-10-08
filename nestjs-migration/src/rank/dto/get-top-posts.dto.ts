import { Transform } from "class-transformer";

export class GetTopPostsRes {
	title: string;
	nickname: string;
	postId: number;

	@Transform(({ value }) => parseInt(value))
	likeCount: number;
}
