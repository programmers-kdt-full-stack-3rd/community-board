import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	JoinColumn,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm";
import { Comment } from "../../comment/entities/comment.entity";
import { Like } from "../../like/entities/like.entity";
import { Post } from "../../post/entities/post.entity";
import { Role } from "../../rbac/entities/roles.entity";
import { CommentLike } from "../../like/entities/comment-like.entity";
import { Member } from "src/chat/entities/member.entity";

@Entity("users")
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 50, unique: true, nullable: true })
	email: string;

	@Column({ length: 50, unique: true })
	nickname: string;

	@Column({ name: "is_delete", default: false })
	isDelete: boolean;

	@Column({ type: "text", nullable: true })
	password: string;

	@Column({ type: "text", nullable: true })
	salt: string;

	@Column({ name: "role_id", default: 2 })
	roleId: number;

	@ManyToOne(() => Role, role => role.id)
	@JoinColumn({ name: "role_id" })
	role: Role;

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	@OneToMany(type => Post, post => post.author)
	posts: Post[];

	@OneToMany(type => Like, like => like.user)
	likes: Like[];

	@OneToMany(type => Comment, comment => comment.author)
	comments: Comment[];

	@OneToMany(type => CommentLike, commentLikes => commentLikes.user)
	@JoinColumn({name: "comment_likes"})
	commentLikes: CommentLike[];

	//chat
	@OneToMany(type => Member, member =>  member.user)
	members: Member[];
}
