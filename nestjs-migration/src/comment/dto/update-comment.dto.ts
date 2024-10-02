import {
	IsDefined,
	IsInt,
	IsNotEmpty,
	IsPositive,
	IsString,
} from "class-validator";
import { COMMENT_ERROR_MESSAGES } from "../constant/comment.constants";

export class UpdateCommentReq {
	@IsNotEmpty({ message: COMMENT_ERROR_MESSAGES.COMMENT_ID_REQUIRED })
	@IsInt()
	@IsPositive({ message: COMMENT_ERROR_MESSAGES.INVALID_COMMENT_ID })
	id: number;

	@IsNotEmpty({ message: COMMENT_ERROR_MESSAGES.CONTENT_REQUIRED })
	@IsString({ message: COMMENT_ERROR_MESSAGES.INVALID_CONTENT })
	content: string;
}

export class UpdateCommentDto {
	@IsDefined()
	id: number;

	@IsDefined()
	authorId: number;

	@IsDefined()
	content: string;
}
