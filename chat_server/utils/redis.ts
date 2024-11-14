import { RedisClientType } from "redis";

import { redis } from "../config";

/**
 * Redis 싱글톤 관리
 */
let redisClient: RedisClientType | null = null;

/**
 * Init Redis
 */
export const initRedis = async () => {
	try {
		if (!redisClient) {
			redisClient = redis;
			await redisClient.connect();
			console.log("Redis 연결 성공");
		}
	} catch (error) {
		throw new Error("Redis 연결 실패");
	}

	return redisClient;
};
