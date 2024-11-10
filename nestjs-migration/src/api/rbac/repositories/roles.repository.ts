import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Role } from "../entities/roles.entity";

@Injectable()
export class RoleRepository extends Repository<Role> {
	constructor(private dataSource: DataSource) {
		super(Role, dataSource.createEntityManager());
	}

	async getPermissionsByRoleId(roleId: number) {
		const role = await this.createQueryBuilder("role")
			.innerJoinAndSelect("role.rolePermissions", "rolePermission")
			.innerJoinAndSelect("rolePermission.permission", "permission")
			.where("role.id = :roleId", { roleId })
			.select("permission.name", "name")
			.getRawMany();

		return role.map(p => p.name);
	}
}
