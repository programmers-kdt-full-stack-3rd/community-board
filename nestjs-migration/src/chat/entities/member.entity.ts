import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { Room } from "./room.entity";
import { User } from "../../user/entities/user.entity";

@Entity("members")
export class Member {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(type => User, user => user.members)
	@JoinColumn({ name: "user_id" })
	user: User;

	@ManyToOne(type => Room, room => room.members)
	@JoinColumn({ name: "room_id" })
	room: Room;

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	@UpdateDateColumn({ name: "updated_at" })
	updatedAt: Date;

	@Column({ name: "is_host", default: false, nullable: true })
	isHost: boolean;

	@Column({ name: "is_entered", default: false, nullable: true })
	isEntered: boolean;

	@Column({ name: "is_deleted", default: false, nullable: true })
	isDeleted: boolean;
}
