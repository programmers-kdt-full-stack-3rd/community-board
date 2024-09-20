import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { OAuthConnection } from "../entities/oauth-connection.entity";

@Injectable()
export class OAuthConnectionRepository extends Repository<OAuthConnection> {
	constructor(private dataSource: DataSource) {
		super(OAuthConnection, dataSource.createEntityManager());
	}

	async getOAuthConnectionByProviderAndAccountId(
		provider: string,
		accountId: string
	) {
		return this.createQueryBuilder("oAuthConnection")
			.innerJoinAndSelect(
				"oAuthConnection.oAuthProvider",
				"oAuthProvider"
			)
			.where("oAuthProvider.name = :provider", { provider })
			.andWhere("oAuthConnection.oAuthAccountId = :accountId", {
				accountId,
			})
			.getOne();
	}
}
