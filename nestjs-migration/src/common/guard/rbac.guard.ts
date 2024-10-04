import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RbacService } from "../../rbac/rbac.service";
import { ServerError } from "../exceptions/server-error.exception";
import { IUserEntity } from "../interface/user-entity.interface";

@Injectable()
export class RbacGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private readonly rbacService: RbacService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const user: IUserEntity = request.user;

		const permissions = this.reflector.getAllAndOverride<string[]>(
			"permissions",
			[context.getHandler(), context.getClass()]
		);

		const adminOnly = this.reflector.getAllAndOverride<boolean>(
			"adminOnly",
			[context.getHandler(), context.getClass()]
		);

		if (adminOnly) {
			const isAdmin = await this.rbacService.isAdmin(user.roleId);
			if (!isAdmin) {
				throw ServerError.forbidden("관리자만 접근 가능합니다.");
			}
		}

		if (!permissions) {
			return true;
		}

		return this.isHasPermission(permissions, user.roleId);
	}

	async isHasPermission(permissions: string[], roleId: number) {
		const rolePermissions =
			await this.rbacService.getPermissionsByRoleId(roleId);
		const hasPermission = permissions.every(permission =>
			rolePermissions.includes(permission)
		);

		if (!hasPermission) {
			throw ServerError.forbidden("권한이 없습니다.");
		}

		return hasPermission;
	}
}
