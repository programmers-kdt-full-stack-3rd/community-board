import { RedisClientType } from "redis";

import { redis } from "../config";

/**
 * Redis 싱글톤 관리
 */
let redisClient: RedisClientType | null = null;

/**
 * Init Redis
 */
const initRedis = async () => {
	try {
		if (!redisClient) {
			redisClient = redis;
			await redisClient.connect();
			console.log("Redis 연결 성공");
		}
	} catch (error) {
		throw new Error("Redis 연결 실패");
	}
};
/**
 * Get Redis
 * @returns redisClient
 */
const getRedis = () => {
	if (!redisClient) throw new Error("Redis 초기화 필요");
	return redisClient;
};

export { initRedis, getRedis };
