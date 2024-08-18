import dotenv from "dotenv";
import { Kafka, logLevel } from "kafkajs";

dotenv.config();

const isDev = !process.env.DOCKER_HOST_IP;

/**
 * Kafka 설정
 */
const kafka = new Kafka({
	clientId: "chat-socket-1", // Kafka와 송수신하는 Client ID
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
	], // Broker URL
	logLevel: logLevel.WARN, // Console의 log 수준 (현재 값: Error or Warning)
	retry: {
		maxRetryTime: 10000, // 최대 재시도 시간
		initialRetryTime: 300, // 처음 재시도까지 대기 시간 (ms)
		retries: 5, // 최대 재시도 횟수
		factor: 1.5, // 재시도 대기시간에 대한 배수, 다음 재시도는 이전 재시도 대기 시간의 factor를 곱한 시간
		multiplier: 1, // factor에 대한 배수
	},
});

export default kafka;
