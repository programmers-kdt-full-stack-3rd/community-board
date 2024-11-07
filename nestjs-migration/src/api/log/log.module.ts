import { Module } from "@nestjs/common";
import { LogRepository } from "./log.repository";
import { LogService } from "./log.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Log } from "./entities/log.entity";

@Module({
	imports: [TypeOrmModule.forFeature([Log])],
	providers: [LogService, LogRepository],
	exports: [LogService],
})
export class LogModule {}
