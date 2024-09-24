import { IsDefined, IsInt, IsNotEmpty, IsPositive, IsString } from "class-validator"
import { ERROR_MESSAGES } from "../constant/comment-constants"

export class UpdateCommentBodyDto {

    @IsDefined({message: ERROR_MESSAGES.COMMENT_ID_REQUIRED})
    @IsNotEmpty({message: ERROR_MESSAGES.COMMENT_ID_REQUIRED})
    @IsInt()
    @IsPositive({message: ERROR_MESSAGES.INVALID_COMMENT_ID})
    id: number

    @IsDefined({message: ERROR_MESSAGES.CONTENT_REQUIRED})
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
