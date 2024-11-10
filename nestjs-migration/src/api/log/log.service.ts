import { Injectable } from "@nestjs/common";
import { AddUserLogDto } from "./dto/add-user-log.dto";
import { GetLogQueryDto } from "./dto/get-log-query.dto";
import { LogRepository } from "./log.repository";

@Injectable()
export class LogService {
	constructor(private logRepository: LogRepository) {}

	async addLog(addUserLogDto: AddUserLogDto) {
		await this.logRepository.save(addUserLogDto);

		//TODO: if rows.affectedRows === 0 : Log 실패
	}

	async getLogs(getLogQueryDto: GetLogQueryDto, userId: number) {
		getLogQueryDto.index -= 1;
		if (getLogQueryDto.index < 0) {
			getLogQueryDto.index = 0;
		}

		if (getLogQueryDto.perPage < 0) {
			getLogQueryDto.perPage = 10;
		}

		return await this.logRepository.getLogs(getLogQueryDto, userId);
	}
}
