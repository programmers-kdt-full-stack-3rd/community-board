import { IsDefined, IsInt, IsOptional, IsPositive } from "class-validator";
import { COMMENT_ERROR_MESSAGES } from "../constant/comment.constants";
import { Transform } from "class-transformer";

export class ReadCommentQuery {
	@IsDefined({ message: COMMENT_ERROR_MESSAGES.POST_ID_REQUIRED })
	@Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
	@IsInt({ message: COMMENT_ERROR_MESSAGES.INVALID_POST_ID })
	@IsPositive({ message: COMMENT_ERROR_MESSAGES.INVALID_POST_ID })
	post_id: number;

	@Transform(({ value }) => (value == "" ? undefined : parseInt(value, 10)), {
		toClassOnly: true,
	})
	index?: number;

	@Transform(
		({ value }) => (value === "" ? undefined : parseInt(value, 10)),
		{ toClassOnly: true }
	)
	@IsOptional()
	@IsInt()
	perPage?: number = 50;

	@IsOptional()
	@IsInt()
	userId?: number;
}

export class CommentsDto {
	id: number;

	content: string;

	author_id: number;

	author_nickname: string;

	@Transform(({ value }) => Boolean(value))
	is_author: boolean;

	created_at: Date;

	updated_at: Date;

	@Transform(({ value }) => parseInt(value))
	likes: number;

	@Transform(({ value }) => Boolean(value))
	user_liked: boolean;
}

export class CommentsResultDto {
	total: number;
	comments: CommentsDto[];
}
