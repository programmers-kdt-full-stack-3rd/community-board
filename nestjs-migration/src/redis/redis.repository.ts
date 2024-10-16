import Redis from "ioredis";
import { Injectable } from "@nestjs/common";
import { redisConfig } from "src/config/redis.config";

@Injectable()
export class RedisRepository {
	private readonly redisClient: Redis;

	constructor() {
		this.redisClient = new Redis(redisConfig);
	}

	//test
	async getRedisData(userId, couponId) {
		return await this.redisClient.smembers(`coupon_${couponId}`);
	}
	async init(couponId) {
		await this.redisClient.del(`coupon_${couponId}`);
	}

	async checkDupCoupon(userId: number, couponId: number): Promise<number> {
		return await this.redisClient.sismember(
			`coupon_${couponId}`,
			`user:${userId}:coupon_log`
		);
	}
	async saveLogToRedis(userId: string, couponId: string): Promise<void> {
		const result = await this.redisClient.sadd(
			`coupon_${couponId}`,
			`user:${userId}:coupon_log`
		);
		console.log("saveLogREdis", result);
	}

	async setStock(couponId: string, stock: number): Promise<void> {
		await this.redisClient.set(
			`coupon_stock_${couponId}`,
			stock.toString()
		);
	}

	// 재고 가져오기
	async getStock(couponId: string): Promise<number | null> {
		const stock = await this.redisClient.get(`coupon_stock_${couponId}`);
		return stock ? parseInt(stock, 10) : null;
	}

	async decreaseStock(couponId: number): Promise<number> {
		return await this.redisClient.decr(`coupon_stock_${couponId}`);
	}
}
