import { User } from "src/user/entities/user.entity";

export class DeletePostDto {
    postId: number;
    authorId: number;
}