import { IsInt, IsNotEmpty, IsString, Min } from "class-validator";
import { ERROR_MESSAGES } from "../constant/comment-constants";

export class CreateCommentBodyDto {
    @IsNotEmpty({message: ERROR_MESSAGES.POST_ID_REQUIRED})
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsInt()
    @Min(1, { message: ERROR_MESSAGES.INVALID_POST_ID})
    post_id: number; 
}
export class CreateCommentDto extends CreateCommentBodyDto {
    @IsNotEmpty({message: ERROR_MESSAGES.USER_ID_REQUIRED})
    authorId: number;
}
