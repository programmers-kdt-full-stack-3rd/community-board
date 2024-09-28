import { Transform } from "class-transformer";
import { IsOptional } from "class-validator";

export class GetPostsDto {
	@IsOptional()
	@Transform(({ value }) => parseInt(value, 10))
	index?: number = 1;

	@IsOptional()
	@Transform(({ value }) => parseInt(value, 10))
	perPage?: number = 10;

	@IsOptional()
	keyword?: string;
}
