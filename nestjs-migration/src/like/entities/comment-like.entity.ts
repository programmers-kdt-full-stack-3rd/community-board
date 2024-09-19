import { Comment } from "src/comment/entities/comment.entity";
import { User } from "src/user/entities/user.entity";
import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("comment_likes")
export class CommentLike {
    
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(type => Comment, comment => comment.comment_likes)
    @JoinColumn({name: "comment_id"})
    comment: number;

    @ManyToOne(type => User, user => user.likes)
    @JoinColumn({name:"user_id"})
    user: number;

    @CreateDateColumn({ name: "created_at"})
    createdAt: Date
}