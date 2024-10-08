import { Transform } from "class-transformer";

export class GetTopPostsRes {
	title: string;
	nickname: string;

	@Transform(({ value }) => parseInt(value))
	likeCount: number;
}
