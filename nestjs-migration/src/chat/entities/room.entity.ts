import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { Member } from "./member.entity";

@Entity("rooms")
export class Room {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 50 })
	name: string;

	@Column({ length: 50, default: null, nullable: true })
	password: string;

	@Column({ name: "is_private", default: false })
	isPrivate: boolean;

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	@UpdateDateColumn({ name: "updated_at" })
	updatedAt: Date;

	@OneToMany(type => Member, member => member.room)
	members: Member[];
}
