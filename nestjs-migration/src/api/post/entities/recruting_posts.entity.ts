import { Room } from "../../chat/entities/room.entity";
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Post } from "./post.entity";

@Entity("recruting_posts")
export class RecrutingPost {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Post, post => post.recrutingPosts, {
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "post_id" })
	post: Post;

	@ManyToOne(() => Room, room => room.recrutingPosts, {
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "room_id" })
	room: Room;
}
