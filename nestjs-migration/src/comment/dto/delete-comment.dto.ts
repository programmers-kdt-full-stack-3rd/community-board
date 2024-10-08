import { IsDefined, IsNumber } from "class-validator";
import { COMMENT_ERROR_MESSAGES } from "../constant/comment.constants";

export class DeleteCommentReq {
	@IsDefined({ message: COMMENT_ERROR_MESSAGES.COMMENT_ID_REQUIRED })
	@IsNumber()
	id: number;

	@IsDefined({ message: COMMENT_ERROR_MESSAGES.USER_ID_REQUIRED })
	@IsNumber()
	authorId: number;
}
