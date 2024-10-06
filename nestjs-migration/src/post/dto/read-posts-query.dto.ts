import { IsOptional } from "class-validator";

export class ReadPostsQuery {
	@IsOptional()
	index?: number = 0;

	@IsOptional()
	perPage?: number = 10;

	@IsOptional()
	keyword?: string;

	@IsOptional()
	category_id?: string;

	@IsOptional()
	sortBy?: SortBy;
}

export enum SortBy {
	VIEWS = 1,
	LIKES = 2,
}
