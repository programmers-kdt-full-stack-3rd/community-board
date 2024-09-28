import { Module } from "@nestjs/common";
import { LogRepository } from "./log.repository";
import { LogService } from "./log.service";

@Module({
	providers: [LogService, LogRepository],
	exports: [LogService],
})
export class LogModule {}
