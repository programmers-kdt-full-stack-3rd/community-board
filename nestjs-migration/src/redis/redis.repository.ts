import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

@Injectable()
export class RedisRepository {
	private readonly redisClient: Redis;

	constructor(private readonly configService: ConfigService) {
		const host: string = this.configService.get("redis.host");
		const port: number = this.configService.get("redis.port");
		this.redisClient = new Redis(port, host);
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
		await this.redisClient.set(`coupon_stock_${couponId}`, stock);
	}

	async getStock(couponId: number): Promise<number> {
		const stock = await this.redisClient.get(`coupon_stock_${couponId}`);
		return parseInt(stock, 10);
	}

	async decreaseStock(couponId: number): Promise<number> {
		return await this.redisClient.decr(`coupon_stock_${couponId}`);
	}
}
