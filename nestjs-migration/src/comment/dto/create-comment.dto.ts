import { IsInt, IsNotEmpty, IsString, Min } from "class-validator";
import { COMMENT_ERROR_MESSAGES } from "../constant/comment.constants";

export class CreateCommentReq {
	@IsNotEmpty({ message: COMMENT_ERROR_MESSAGES.CONTENT_REQUIRED })
	@IsString()
	content: string;

	@IsNotEmpty({ message: COMMENT_ERROR_MESSAGES.POST_ID_REQUIRED })
	@IsInt()
	@Min(1, { message: COMMENT_ERROR_MESSAGES.INVALID_POST_ID })
	post_id: number;
}
export class CreateCommentDto extends CreateCommentReq {
	@IsNotEmpty({ message: COMMENT_ERROR_MESSAGES.USER_ID_REQUIRED })
	authorId: number;
}
