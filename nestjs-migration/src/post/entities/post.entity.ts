import { Comment } from "../../comment/entities/comment.entity";
import { Like } from "../../like/entities/like.entity";
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
import { PostCategories } from "./post_categories.entity";
import { RecrutingPost } from "./recruting_posts.entity";

@Entity("posts")
export class Post {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	title: string;

	@Column()
	content: string;

	@ManyToOne(() => PostCategories, category => category.id)
	@JoinColumn({ name: "category_id" })
	category: PostCategories;

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	@UpdateDateColumn({ name: "updated_at" })
	updatedAt: Date;

	@Column({ default: 0 })
	views: number;

	@Column({ name: "is_delete", default: false })
	isDelete: boolean;

	@Column({ name: "is_private", default: false })
	isPrivate: boolean;

	@ManyToOne(type => User, user => user.posts)
	@JoinColumn({ name: "author_id" })
	author: User;

	@OneToMany(type => Like, like => like.post)
	likes: Like[];

	@OneToMany(type => Comment, comment => comment.post)
	comments: Comment[];

	@OneToMany(type => RecrutingPost, recrutingPost => recrutingPost.post)
	recrutingPosts: RecrutingPost[];
}
