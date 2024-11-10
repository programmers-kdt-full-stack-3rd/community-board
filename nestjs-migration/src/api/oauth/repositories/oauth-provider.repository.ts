import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { OAuthProvider } from "../entities/oauth-provider.entity";

@Injectable()
export class OAuthProviderRepository extends Repository<OAuthProvider> {
	constructor(private dataSource: DataSource) {
		super(OAuthProvider, dataSource.createEntityManager());
	}
}
