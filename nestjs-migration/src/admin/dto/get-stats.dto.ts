import { Type } from "class-transformer";
import { IsDateString, IsOptional, IsString, Matches } from "class-validator";
import { TInterval } from "shared";

export class GetStatsQueryDto {
	@IsOptional()
	@IsDateString({}, { message: "startDate가 잘못되었습니다." })
	@Matches(/^\d{4}-\d{2}-\d{2}$/, { message: "startDate가 잘못되었습니다." })
	@Type(() => String)
	startDate?: string;

	@IsOptional()
	@IsDateString({}, { message: "endDate가 잘못되었습니다." })
	@Matches(/^\d{4}-\d{2}-\d{2}$/, { message: "endDate가 잘못되었습니다." })
	@Type(() => String)
	endDate?: string;

	@IsOptional()
	@IsString()
	interval?: TInterval = "daily";
}
