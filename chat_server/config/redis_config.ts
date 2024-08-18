import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config();

const isDev = !process.env.DOCKER_HOST_IP;

const redisClient = createClient({
	url: isDev
		? "redis://localhost:6379"
		: `${process.env.DOCKER_HOST_IP}:${process.env.REDIS_PORT}`,
});

const connectRedis = async () => {
	try {
		await redisClient.connect();
		console.log("Connected to Redis");
	} catch (error) {
		console.error("Could not connect to Redis", error);
	}
};

export { redisClient, connectRedis };
