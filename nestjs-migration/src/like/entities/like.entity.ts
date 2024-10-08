import { Post } from "../../post/entities/post.entity";
import { User } from "../../user/entities/user.entity";
import {
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";

@Entity("post_likes")
export class Like {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(type => Post, post => post.likes)
	@JoinColumn({ name: "post_id" })
	post: Post;

	@ManyToOne(type => User, user => user.likes)
	@JoinColumn({ name: "user_id" })
	user: User;

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;
}
