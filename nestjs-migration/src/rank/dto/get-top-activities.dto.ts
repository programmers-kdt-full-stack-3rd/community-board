import { Transform } from "class-transformer";

export class GetTopActivties {
	nickname: string;

	@Transform(({ value }) => parseInt(value))
	postCount: number;

	@Transform(({ value }) => parseInt(value))
	commentCount: number;
}
