import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { RefreshTokens } from "./entity/refresh-tokens.entity";

@Injectable()
export class RefreshTokensRepository extends Repository<RefreshTokens> {
	constructor(private dataSource: DataSource) {
		super(RefreshTokens, dataSource.createEntityManager());
	}
}
