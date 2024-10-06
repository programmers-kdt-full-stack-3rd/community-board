import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { LogCategory } from "./log-category.entity";

@Entity("user_logs")
export class Log {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ name: "user_id" })
	userId: number;

	@Column({ length: 255 })
	title: string;

	@Column({ name: "category_id" })
	categoryId: number;

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	@ManyToOne(() => LogCategory, category => category.id)
	@JoinColumn({ name: "category_id" })
	category: LogCategory;
}
