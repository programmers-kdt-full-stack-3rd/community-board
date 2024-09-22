import { IsDefined } from "class-validator";

export class HandleCommentLikeDto {

    @IsDefined()
    commentId: number;

    @IsDefined()
    userId: number;
}