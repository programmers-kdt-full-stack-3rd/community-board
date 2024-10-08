import { Transform } from "class-transformer";
import { IsOptional } from "class-validator";

export class ReadPostsQuery {
	@IsOptional()
	index?: number = 0;

	@IsOptional()
	perPage?: number = 10;

	@IsOptional()
	keyword?: string;

	@IsOptional()
	@Transform(({ value }) => parseInt(value))
	category_id?: number;

	@IsOptional()
	sortBy?: SortBy;
}

export enum SortBy {
	VIEWS = 1,
	LIKES = 2,
}
