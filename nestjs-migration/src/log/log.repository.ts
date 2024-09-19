import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Log } from "./entity/log.entity";


@Injectable()
export class LogRepository extends Repository<Log> {
	constructor(private dataSource: DataSource) {
		super(Log, dataSource.createEntityManager());
	}
}
