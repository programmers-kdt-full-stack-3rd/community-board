import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RolePermission } from "./role-permission.entity";

@Entity("permissions")
export class Permission {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 100, nullable: false, unique: true })
	name: string;

	@OneToMany(
		() => RolePermission,
		rolePermission => rolePermission.permission
	)
	rolePermissions: RolePermission[];
}
