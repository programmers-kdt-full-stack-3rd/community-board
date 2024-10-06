import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";

@Entity("messages")
export class Message {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	memberId: number;

	@Column()
	message: string;

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	@UpdateDateColumn({ name: "is_system", default: false })
	isSystem: boolean;
}
