import { IsDefined, IsInt, IsNotEmpty, IsOptional, IsPositive, Min } from "class-validator";
import { ERROR_MESSAGES } from "../constant/comment-constants";
import { Transform } from "class-transformer";


export class ReadCommentQueryDto {

    @IsDefined({ message: ERROR_MESSAGES.POST_ID_REQUIRED})
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
    @IsInt()
    @IsPositive()
    perPage: number = 50;

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
    total : number;
    comments: CommentsDto[];
}