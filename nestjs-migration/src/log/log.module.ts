import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { LogRepository } from './log.repository';

@Module({
  providers: [LogService,LogRepository]
})
export class LogModule {}
