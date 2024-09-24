import { IsDefined, IsNotEmpty } from "class-validator";

export class DeleteCommentDto {

    @IsDefined()
    @IsNotEmpty()
    id: number;

    @IsDefined()
    @IsNotEmpty()
    authorId: number;

}