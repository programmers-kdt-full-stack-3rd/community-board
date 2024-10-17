import { Transform } from "class-transformer";
import {
	IsBoolean,
	IsNumber,
	IsOptional,
	IsString,
	Min,
} from "class-validator";
import { optionalBooleanMapper } from "src/utils/boolean_map";

export class ReadRoomQuery {
	@IsOptional()
	@Transform(({ value }) => Number(value))
	@IsNumber()
	@Min(0)
	page: number = 0;

	@IsOptional()
	@Transform(({ value }) => Number(value))
	@IsNumber()
	@Min(1)
	perPage: number = 2;

	@IsOptional()
	@Transform(({ value }) => optionalBooleanMapper[value])
	@IsBoolean()
	isSearch?: boolean;

	@IsOptional()
	@IsString()
	keyword?: string;
}

export class ReadRoomByKeywordDto extends ReadRoomQuery {}

export class ReadRoomByUserIdDto {
	userId: number;
	page: number;
	perPage: number;
}
