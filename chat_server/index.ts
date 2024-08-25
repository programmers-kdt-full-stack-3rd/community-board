import dotenv from "dotenv";

import httpServer from "./app";
import { getRedisAPI, initRedisAPI } from "./config/redis_config";
import { getKafkaAPI, initKafkaAPI } from "./config/kafka_config";
import { getProducer, initProducer } from "./services/kafka_service";

dotenv.config();

async function startServer() {
	// 호스트 IP
	const HOST_IP = process.env.DOCKER_HOST_IP || "localhost";

	// 레디스 PORT
	const REDIS_PORT = process.env.REDIS_PORT || "6379";

	// 카프카 PORT
	const KAFKA_PORT_1 = process.env.KAFKA_PORT_1 || "9092";
	const KAFKA_PORT_2 = process.env.KAFKA_PORT_2 || "9093";
	const KAFKA_PORT_3 = process.env.KAFKA_PORT_3 || "9094";

	// 채팅 소켓 PORT
	const CHAT_PORT = process.env.CHAT_PORT || 3000;

	// HTTP PORT
	const HTTP_PORT = process.env.HTTP_PORT || 8000;

	// 레디스 서버 URL
	const REDIS_URL = `redis://${HOST_IP}:${REDIS_PORT}`;

	// Broker URLs
	const brokers: string[] = [
		`${HOST_IP}:${KAFKA_PORT_1}`,
		`${HOST_IP}:${KAFKA_PORT_2}`,
		`${HOST_IP}:${KAFKA_PORT_3}`,
	];

	// HTTP URL
	const HTTP_URL = `http://${HOST_IP}:${HTTP_PORT}`;

	try {
		// Redis 연결
		initRedisAPI(REDIS_URL);
		const redis = getRedisAPI();
		await redis.connect();
		console.log("Redis 연결 성공");

		// Kafka API
		initKafkaAPI("chat-group1-consumer1", brokers);
		const kafka = getKafkaAPI();

		// Kafka Producer
		initProducer(kafka);
		const producer = getProducer();

		// Kafka Producer 연결
		await producer.connect();
		console.log("Kafka Producer 연결 성공");

		// 채팅 서버 실행
		httpServer.listen(CHAT_PORT, () => {
			console.log(`채팅 서버 ${CHAT_PORT}에서 실행 중`);
		});
	} catch (error) {
		console.error("서버 시작 중 오류 발생:", error);
	}
}

// 서버 실행
startServer();
