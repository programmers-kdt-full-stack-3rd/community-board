import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class ReadRoomQuery {
	@IsOptional()
	@IsNumber()
	page?: number = 0;

	@IsOptional()
	@IsNumber()
	perPage?: number = 2;

	@IsOptional()
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
