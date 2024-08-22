import { createClient, RedisClientType } from "redis";

/**
 * Redis API 객체
 */
let redis: RedisClientType | null = null;

const initRedisAPI = (url: string) => {
	if (redis === null) {
		redis = createClient({
			url,
		});
	}
};

/**
 * get Redis API
 */
const getRedisAPI = (): RedisClientType => {
	if (redis === null) {
		throw new Error("Redis API is null");
	}

	return redis;
};

export { getRedisAPI, initRedisAPI };
