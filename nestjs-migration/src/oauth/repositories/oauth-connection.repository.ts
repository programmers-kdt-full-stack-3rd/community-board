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

	async getOAuthConnectionByUserId(userId: number) {
		return this.createQueryBuilder("oAuthConnection")
			.innerJoinAndSelect(
				"oAuthConnection.oAuthProvider",
				"oAuthProvider"
			)
			.where("oAuthConnection.userId = :userId", { userId })
			.andWhere("oAuthConnection.isDelete = :isDelete", {
				isDelete: false,
			})
			.getMany();
	}

	async getOAuthConnectionByProviderAndUserId(
		provider: string,
		userId: number
	) {
		return this.createQueryBuilder("oAuthConnection")
			.innerJoinAndSelect(
				"oAuthConnection.oAuthProvider",
				"oAuthProvider"
			)
			.where("oAuthConnection.isDelete = :isDelete", { isDelete: false })
			.andWhere("oAuthProvider.name = :provider", { provider })
			.andWhere("oAuthConnection.userId = :userId", { userId })
			.getOne();
	}

	async clearOAuthConnectionByUserId(userId: number) {
		return this.createQueryBuilder("oAuthConnection")
			.update()
			.set({ oAuthRefreshToken: null, isDelete: true })
			.where("userId = :userId", { userId })
			.execute();
	}
}
