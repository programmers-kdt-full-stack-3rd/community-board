import { Injectable } from "@nestjs/common";
import { RedisRepository } from "./api/redis/redis.repository";

@Injectable()
export class AppService {
	constructor(private readonly redisRepository: RedisRepository) {}

	getHello(): string {
		return "Hello World!";
	}
	async onModuleInit() {
		// Redis에 미리 설정된 재고값 확인, 없으면 초기화
		const stock = await this.redisRepository.getStock(1);
		console.log("쿠폰 개수", stock);
		if (!stock) {
			// 재고가 없으면 초기화
			await this.redisRepository.setStock(1, 30);
			console.log("Nest 시작할 떄마다 일단 쿠폰 30개로 고정.");
		}
	}
}
