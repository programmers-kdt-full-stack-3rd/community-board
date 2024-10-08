import { Transform } from "class-transformer";

export class GetTopCommentsRes {
	nickname: string;
	postId: number;
	commentId: number;

	@Transform(({ value }) => parseInt(value))
	likeCount: number;
}
