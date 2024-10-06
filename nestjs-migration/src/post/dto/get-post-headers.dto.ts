import { Transform } from "class-transformer";

export class GetPostHeadersDto {
	id: number;
	title: string;
	nickname: string;
	created_at: Date;
	views: number;

	@Transform(({ value }) => parseInt(value))
	likes: number;
}
