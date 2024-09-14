import { Injectable } from "@nestjs/common";
import { PermissionRepository } from "./repositories/permissions.repository";
import { rolePermissionRepository } from "./repositories/role-permission.repository";
import { RoleRepository } from "./repositories/roles.repository";

@Injectable()
export class RbacService {
	constructor(
		private readonly roleRepository: RoleRepository,
		private readonly permissionRepository: PermissionRepository,
		private readonly rolePermissionRepository: rolePermissionRepository
	) {}

	async getPermissionsByRoleId(roleId: number) {
		const permissions =
			await this.roleRepository.getPermissionsByRoleId(roleId);
		return permissions;
	}

	async isAdmin(roleId: number) {
		const role = await this.roleRepository.findOne({
			where: { id: roleId },
		});
		return role.name === "admin";
	}
}
