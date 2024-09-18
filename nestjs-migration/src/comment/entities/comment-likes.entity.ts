import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Comment } from "./comment.entity";
import { User } from "src/user/entities/user.entity";

@Entity("comment_likes")
export class CommentLikes {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Comment, comment => comment.comment_likes)
    comment: number;

    @ManyToOne(type => User, comment => comment.commentLikes)
    user: number;

    @CreateDateColumn({name: "created_at", nullable: false})
    createdAt: Date;


}