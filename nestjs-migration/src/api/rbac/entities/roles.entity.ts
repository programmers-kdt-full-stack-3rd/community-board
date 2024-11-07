import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RolePermission } from "./role-permission.entity";

@Entity("roles")
export class Role {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 50, unique: true })
	name: string;

	@OneToMany(() => RolePermission, rolePermission => rolePermission.role)
	rolePermissions: RolePermission[];
}
