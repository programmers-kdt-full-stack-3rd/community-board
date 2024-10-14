import { Type } from "class-transformer";
import {
	IsBoolean,
	IsNumber,
	IsOptional,
	IsString,
	Min,
} from "class-validator";

export class ReadRoomQuery {
	@IsOptional()
	@Type(() => Number) // 쿼리 파라미터를 숫자로 변환
	@IsNumber()
	@Min(0)
	page: number = 0;

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	@Min(1)
	perPage: number = 2;

	@IsOptional()
	@Type(() => Boolean)
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
