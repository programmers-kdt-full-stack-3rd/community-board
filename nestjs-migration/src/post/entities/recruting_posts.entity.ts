import { Room } from "src/chat/entities/room.entity";
import {
	Entity,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
	Column,
	Unique,
} from "typeorm";
import { Post } from "./post.entity";

@Entity("recruting_posts")
export class RecrutingPost {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ name: "post_id" })
	postId: number;

	@Column({ name: "room_id" })
	roomId: number;

	@ManyToOne(() => Post, post => post.id, { onDelete: "CASCADE" })
	@JoinColumn({ name: "post_id" })
	post: Post;

	@ManyToOne(() => Room, room => room.id, { onDelete: "CASCADE" })
	@JoinColumn({ name: "room_id" })
	room: Room;
}
