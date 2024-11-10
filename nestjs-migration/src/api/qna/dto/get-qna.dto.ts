import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsInt } from "class-validator";

export class GetQnAAcceptInfoReq {
	@IsArray()
	@ArrayMinSize(1)
	@IsInt({ each: true })
	@Type(() => Number)
	postIds: number[];
}

export class GetQnAAcceptInfoRes {
	commentIds: (number | null)[];
}
