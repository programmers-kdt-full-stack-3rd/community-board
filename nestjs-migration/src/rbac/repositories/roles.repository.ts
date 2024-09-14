import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Role } from "../entities/roles.entity";

@Injectable()
export class RoleRepository extends Repository<Role> {
	constructor(private dataSource: DataSource) {
		super(Role, dataSource.createEntityManager());
	}
}
