import { Comment } from "src/comment/entities/comment.entity";
import { Post } from "../../post/entities/post.entity";
import { User } from "../../user/entities/user.entity";
import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("post_likes")
export class Like {
    
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(type => Post, post => post.likes)
    @JoinColumn({name: "post_id"})
    post: number;

    @ManyToOne(type => User, user => user.likes)
    @JoinColumn({name:"user_id"})
    user: number;

    @ManyToOne(type => Comment, comment => comment.likes)
    comment: number;

    @CreateDateColumn({ name: "created_at"})
    createdAt: Date

}