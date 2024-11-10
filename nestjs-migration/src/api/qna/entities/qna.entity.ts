import {
	Entity,
	PrimaryGeneratedColumn,
	Unique,
	JoinColumn,
	OneToOne,
} from "typeorm";

import { Comment } from "../../comment/entities/comment.entity";
import { Post } from "../../post/entities/post.entity";

@Entity("qna")
@Unique(["comment", "post"])
export class QnA {
	@PrimaryGeneratedColumn()
	id: number;

	@OneToOne(() => Post)
	@JoinColumn({ name: "post_id" })
	post: Post;

	@OneToOne(() => Comment)
	@JoinColumn({ name: "comment_id" })
	comment: Comment;
}
