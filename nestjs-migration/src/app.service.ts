import { Injectable } from "@nestjs/common";
import { RedisRepository } from "./redis/redis.repository";

@Injectable()
export class AppService {
	constructor(private readonly redisRepository: RedisRepository) {}

	async onModuleInit() {
		// Redis에 미리 설정된 재고값 확인, 없으면 초기화
		const stock = await this.redisRepository.getStock(1);
		if (!stock) {
			// 재고가 없으면 초기화
			await this.redisRepository.setStock(1, 30);
		}
	}
}
