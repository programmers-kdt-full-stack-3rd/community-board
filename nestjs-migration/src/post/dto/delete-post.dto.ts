import { IsNotEmpty, IsOptional, IsPositive } from "class-validator";
import { POST_ERROR_MESSAGES } from "../constant/post.constants";

export class DeletePostDto {
	@IsOptional()
	authorId?: number;

	@IsNotEmpty()
	@IsPositive({ message: POST_ERROR_MESSAGES.INVALID_POST_ID })
	postId: number;
}
