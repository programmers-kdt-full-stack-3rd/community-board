import { Injectable } from "@nestjs/common";
import { IUserLogResponse } from "shared";
import { DataSource, Repository } from "typeorm";
import { GetLogQueryDto } from "./dto/get-log-query.dto";
import { Log } from "./entities/log.entity";

@Injectable()
export class LogRepository extends Repository<Log> {
	constructor(private dataSource: DataSource) {
		super(Log, dataSource.createEntityManager());
	}

	async getLogs(
		getLogQueryDto: GetLogQueryDto,
		userId: number
	): Promise<IUserLogResponse> {
		const { index, perPage } = getLogQueryDto;

		const queryBuilder = this.createQueryBuilder("log")
			.select(["log.title", "log.createdAt", "category.name"])
			.leftJoin("log.category", "category")
			.where("log.userId = :userId", { userId })
			.orderBy("log.createdAt", "DESC")
			.limit(perPage)
			.offset(index * perPage);

		const [logs, total] = await queryBuilder.getManyAndCount();

		return {
			total,
			logs: logs.map(log => ({
				title: log.title,
				category: log.category.name,
				createdAt: log.createdAt,
			})),
		};
	}
}
