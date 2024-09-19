import { Module } from "@nestjs/common";
import { RbacService } from "./rbac.service";
import { PermissionRepository } from "./repositories/permissions.repository";
import { rolePermissionRepository } from "./repositories/role-permission.repository";
import { RoleRepository } from "./repositories/roles.repository";

@Module({
	providers: [
		RbacService,
		RoleRepository,
		PermissionRepository,
		rolePermissionRepository,
	],
	exports: [RbacService],
})
export class RbacModule {}
