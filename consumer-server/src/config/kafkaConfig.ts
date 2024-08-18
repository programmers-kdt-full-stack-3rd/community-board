import dotenv from "dotenv";
import { Kafka, logLevel } from "kafkajs";

dotenv.config();

const isDev = !process.env.DOCKER_HOST_IP;

const kafka = new Kafka({
	clientId: "chat-consumer-1",
	brokers: [
		isDev
			? "localhost:9092"
			: `${process.env.DOCKER_HOST_IP}:${process.env.KAFKA_1_PORT}`,
		isDev
			? "localhost:9092"
			: `${process.env.DOCKER_HOST_IP}:${process.env.KAFKA_2_PORT}`,
		isDev
			? "localhost:9092"
			: `${process.env.DOCKER_HOST_IP}:${process.env.KAFKA_3_PORT}`,
	],
	logLevel: logLevel.WARN,
	retry: {
		maxRetryTime: 10000,
		initialRetryTime: 300,
		retries: 5,
		factor: 1.5,
		multiplier: 1,
	},
});

export default kafka;
