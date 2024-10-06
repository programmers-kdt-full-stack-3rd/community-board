import { IsNotEmpty } from "class-validator";
import { POST_ERROR_MESSAGES } from "../constant/post.constants";

export class CreatePostReq {
	@IsNotEmpty({ message: POST_ERROR_MESSAGES.TITLE_REQUIRED })
	title: string;

	@IsNotEmpty({ message: POST_ERROR_MESSAGES.CONTENT_REQUIRED })
	content: string;

	doFilter: boolean;
}

export class CreatePostDto extends CreatePostReq {
	@IsNotEmpty()
	authorId: number;
}
