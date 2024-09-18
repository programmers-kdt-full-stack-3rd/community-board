import { IsInt, IsNotEmpty, IsOptional, IsPositive, Min } from "class-validator";
import { ERROR_MESSAGES } from "../constant/comment-constants";
import { Transform } from "class-transformer";


export class ReadCommentQueryDto {

    @IsNotEmpty({ message: ERROR_MESSAGES.POST_ID_REQUIRED})
    @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
    @IsInt({ message: ERROR_MESSAGES.INVALID_POST_ID})
    @IsPositive({ message: ERROR_MESSAGES.INVALID_POST_ID})
    post_id: number;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
    @IsInt()
    @IsPositive()
    index: number;

    @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
    @IsPositive()
    perPage: number = 50;
}

export class ReadCommentsDto {
    postId: number;
    index: number;
    perPage: number;
    userId: number;
}