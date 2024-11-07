import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Permission } from "./permissions.entity";
import { Role } from "./roles.entity";

@Entity("role_permission")
export class RolePermission {
	@PrimaryColumn({ name: "role_id" })
	roleId: number;

	@PrimaryColumn({ name: "permission_id" })
	permissionId: number;

	@ManyToOne(() => Role, role => role.id)
	@JoinColumn({ name: "role_id" })
	role: Role;

	@ManyToOne(() => Permission, permission => permission.id)
	@JoinColumn({ name: "permission_id" })
	permission: Permission;
}
