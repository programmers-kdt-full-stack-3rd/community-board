import { IsInt, IsNotEmpty, IsPositive, IsString } from "class-validator"
import { ERROR_MESSAGES } from "../constant/comment-constants"

export class UpdateCommentBodyDto {

    @IsNotEmpty()
    @IsInt({message: ERROR_MESSAGES.INVALID_COMMENT_ID})
    @IsPositive({message: ERROR_MESSAGES.INVALID_COMMENT_ID})
    id: number

    @IsNotEmpty({message: ERROR_MESSAGES.CONTENT_REQUIRED})
    @IsString({message: ERROR_MESSAGES.INVALID_CONTENT})
    content: string
}

export class UpdateCommentDto {

    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    authorId: number;

    @IsNotEmpty()
    content: string;
}
