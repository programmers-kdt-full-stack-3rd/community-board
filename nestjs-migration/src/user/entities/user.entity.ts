import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { Role } from "../../rbac/entities/roles.entity";

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
}
