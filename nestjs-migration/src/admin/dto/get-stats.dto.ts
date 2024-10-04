import { IsOptional, IsString, Matches } from "class-validator";
import { TInterval } from "shared";

export class GetStatsQueryDto {
	@IsOptional()
	@Matches(/^\d{4}-\d{2}-\d{2}$/, { message: "startDate가 잘못되었습니다." })
	startDate?: string;

	@IsOptional()
	@Matches(/^\d{4}-\d{2}-\d{2}$/, { message: "endDate가 잘못되었습니다." })
	endDate?: string;

	@IsOptional()
	@IsString()
	interval?: TInterval = "daily";
}
