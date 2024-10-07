import { createClient, RedisClientType } from "redis";

// 동적 import
process.env.NODE_ENV !== "production" &&
	require("dotenv").config({ path: "./../.env" });

const redis: RedisClientType = createClient({
	url: `redis://${process.env.DOCKER_HOST_IP}:${process.env.REDIS_PORT}`,
});

export default redis;
