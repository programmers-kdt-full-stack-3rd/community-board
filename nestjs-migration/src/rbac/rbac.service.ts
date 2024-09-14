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
}
