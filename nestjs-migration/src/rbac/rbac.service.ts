import { Injectable } from "@nestjs/common";
import { ServerError } from "../common/exceptions/server-error.exception";
import { RBAC_ERROR_MESSAGES } from "./constants/rbac.constants";
import { RoleRepository } from "./repositories/roles.repository";

@Injectable()
export class RbacService {
	constructor(private readonly roleRepository: RoleRepository) {}

	async getPermissionsByRoleId(roleId: number) {
		const permissions =
			await this.roleRepository.getPermissionsByRoleId(roleId);
		if (permissions.length === 0) {
			throw ServerError.notFound(
				RBAC_ERROR_MESSAGES.NOT_FOUND_ROLE_PERMISSION
			);
		}
		return permissions;
	}

	async isAdmin(roleId: number) {
		const role = await this.roleRepository.findOne({
			where: { id: roleId },
		});

		if (!role) {
			throw ServerError.notFound(RBAC_ERROR_MESSAGES.NOT_FOUND_ROLE);
		}
		return role.name === "admin";
	}
}
