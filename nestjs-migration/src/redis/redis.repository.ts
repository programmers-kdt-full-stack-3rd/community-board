import Redis from "ioredis";
import { Injectable } from "@nestjs/common";
import { redisConfig } from "src/config/redis.config";

@Injectable()
export class RedisRepository {
	private readonly redisClient: Redis;

	constructor() {
		this.redisClient = new Redis(redisConfig);
	}

	//test용
	async getRedisData(userId: number, couponId: number) {
		return await this.redisClient.smembers(`coupon_${couponId}`);
	}
	//test용
	async init(couponId: number) {
		await this.redisClient.del(`coupon_${couponId}`);
	}

	async checkDupCoupon(userId: number, couponId: number): Promise<number> {
		return await this.redisClient.sismember(
			`coupon_${couponId}`,
			`user:${userId}:coupon_log`
		);
	}
	async saveLogToRedis(userId: number, couponId: number): Promise<void> {
		const result = await this.redisClient.sadd(
			`coupon_${couponId}`,
			`user:${userId}:coupon_log`
		);
		console.log("saveLogREdis", result);
	}

	async setStock(couponId: number, stock: number): Promise<void> {
		await this.redisClient.set(
			`coupon_stock_${couponId}`,
			stock.toString()
		);
	}

	async getStock(couponId: number): Promise<number | null> {
		const stock = await this.redisClient.get(`coupon_stock_${couponId}`);
		return stock ? parseInt(stock, 10) : null;
	}

	async decreaseStock(couponId: number): Promise<number> {
		return await this.redisClient.decr(`coupon_stock_${couponId}`);
	}
}
