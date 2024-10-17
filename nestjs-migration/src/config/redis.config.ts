import { configDotenv } from "dotenv";
//TODO: path 설정
configDotenv({ path: "./../../nginx/.env" });

export const redisConfig = {
	host: process.env.REDIS_HOST || "localhost",
	port: parseInt(process.env.REDIS_PORT) || 6379,
	// password: process.env.REDIS_PASSWORD,
};
