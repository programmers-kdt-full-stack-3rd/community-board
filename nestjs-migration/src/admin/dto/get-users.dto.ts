import { Transform } from "class-transformer";
import { IsOptional } from "class-validator";

export class GetUsersDto {
	@IsOptional()
	@Transform(({ value }) => parseInt(value, 10))
	index?: number = 0;

	@IsOptional()
	@Transform(({ value }) => parseInt(value, 10))
	perPage?: number = 10;

	@IsOptional()
	email?: string;

	@IsOptional()
	nickname?: string;
}
