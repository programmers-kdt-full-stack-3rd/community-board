import { IsDefined, IsNotEmpty, ValidateIf } from "class-validator";
import { POST_ERROR_MESSAGES } from "../constant/post.constants";

export class UpdatePostReq {
	@ValidateIf(p => p.content == "" && p.title == "")
	@IsNotEmpty({ message: POST_ERROR_MESSAGES.TITLE_REQUIRED })
	title: string;

	@ValidateIf(p => p.content == "" && p.title == "")
	@IsNotEmpty({ message: POST_ERROR_MESSAGES.CONTENT_REQUIRED })
	content: string;

	doFilter: boolean;
}
export class UpdatePostDto extends UpdatePostReq {
	@IsDefined()
	authorId: number;
}
