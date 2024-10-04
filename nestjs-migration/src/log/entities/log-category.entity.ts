import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("user_log_categories")
export class LogCategory {
	@PrimaryGeneratedColumn()
	id: number;
	@Column()
	name: string;
}
