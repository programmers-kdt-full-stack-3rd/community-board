import { Module } from "@nestjs/common";
import { RedisService } from "./redis.service";
import { RedisController } from "./redis.controller";
import { RedisRepository } from "./redis.repository";

@Module({
	controllers: [RedisController],
	providers: [RedisService, RedisRepository],
	exports: [RedisRepository],
})
export class RedisModule {}
