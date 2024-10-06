import { CommentLike } from "../../like/entities/comment-like.entity";
import { Post } from "../../post/entities/post.entity";
import { User } from "../../user/entities/user.entity";
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";

@Entity("comments")
export class Comment {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "text", nullable: false })
	content: string;

	@ManyToOne(type => User, user => user.comments)
	@JoinColumn({ name: "author_id" })
	author: number;

	@ManyToOne(type => Post, post => post.comments)
	@JoinColumn({ name: "post_id" })
	post: Post;

	@CreateDateColumn({ name: "created_at", nullable: false })
	createdAt: Date;

	@UpdateDateColumn({ name: "updated_at" })
	updatedAt: Date;

	@Column({ name: "is_delete", nullable: false, default: false })
	isDelete: boolean;

	@OneToMany(type => CommentLike, commentLikes => commentLikes.comment)
	comment_likes: CommentLike[];
}
