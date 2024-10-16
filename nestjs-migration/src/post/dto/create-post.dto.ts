import {
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsPositive,
	Max,
} from "class-validator";
import { POST_ERROR_MESSAGES } from "../constant/post.constants";
import { Transform, Type } from "class-transformer";

export class CreatePostReq {
	@IsNotEmpty({ message: POST_ERROR_MESSAGES.TITLE_REQUIRED })
	title: string;

	@IsNotEmpty({ message: POST_ERROR_MESSAGES.CONTENT_REQUIRED })
	content: string;

	@IsNotEmpty({ message: POST_ERROR_MESSAGES.CATEGORY_ID_REQUIRED })
	@Transform(({ value }) => parseInt(value))
	@IsPositive({ message: POST_ERROR_MESSAGES.INVALID_CATEGORY_ID })
	@Max(5)
	category_id: number;

	doFilter: boolean;

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	roomId: number;
}

export class CreatePostDto extends CreatePostReq {
	@IsNotEmpty()
	authorId: number;
}
