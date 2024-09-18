import { Injectable } from '@nestjs/common';
import { AddUserLogDto } from './dto/add-user-log.dto';
import { LogRepository } from './log.repository';
import { GetLogDto } from './dto/get-log.dto';

@Injectable()
export class LogService {
    constructor(
        private logRepository: LogRepository,
    ){}

    async addLog (addUserLogDto : AddUserLogDto) {
        await this.logRepository.save(addUserLogDto)

        //TODO: if rows.affectedRows === 0 : Log 실패 
    }

    async getLogs (getLogDto: GetLogDto) {
        //TODO 
        `SELECT COUNT(*) OVER() as total, logs.title, categories.name as category, logs.created_at 
        FROM user_logs as logs
        LEFT JOIN user_log_categories as categories
        ON logs.category_id = categories.id 
        WHERE logs.user_id = ?
        ORDER BY logs.created_at DESC
        LIMIT ? OFFSET ?`;
    }
}
