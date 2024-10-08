import { Transform } from "class-transformer";

export class GetTopCommentsRes {
	nickname: string;

	@Transform(({ value }) => parseInt(value))
	likeCount: number;
}
