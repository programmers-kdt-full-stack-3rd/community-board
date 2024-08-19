import dotenv from "dotenv";
import { IMessage } from "shared";

import httpServer from "./app";
import { connectRedis } from "./config/redis_config";
import { getKafkaAPI, initKafkaAPI } from "./config/kafka_config";
import {
	getProducer,
	initProducer,
	sendMessage,
} from "./services/kafka_service";

dotenv.config();

async function startServer() {
	// 도커 호스트 IP
	const DOCKER_HOST_IP = process.env.DOCKER_HOST_IP;

	// 채팅 소켓 PORT
	const CHAT_PORT = process.env.CHAT_PORT || 3000;

	// 카프카 PORT
	const KAFKA_PORT_1 = process.env.KAFKA_PORT_1;
	const KAFKA_PORT_2 = process.env.KAFKA_PORT_2;
	const KAFKA_PORT_3 = process.env.KAFKA_PORT_3;

	// 레디스 PORT
	const REDIS_PORT = process.env.REDIS_PORT;

	// 레디스 서버 URL
	const REDIS_URL =
		DOCKER_HOST_IP && REDIS_PORT
			? `${DOCKER_HOST_IP}:${REDIS_PORT}`
			: "localhost:6379";

	// Broker URLs
	const brokers: string[] = [
		DOCKER_HOST_IP && KAFKA_PORT_1
			? `${DOCKER_HOST_IP}:${KAFKA_PORT_1}`
			: "localhost:9092",
		DOCKER_HOST_IP && KAFKA_PORT_2
			? `${DOCKER_HOST_IP}:${KAFKA_PORT_2}`
			: "localhost:9093",
		DOCKER_HOST_IP && KAFKA_PORT_3
			? `${DOCKER_HOST_IP}:${KAFKA_PORT_3}`
			: "localhost:9094",
	];

	try {
		// Redis 연결
		await connectRedis();
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

		// TEST: 추후 지울 것! (Kafka로 message 보내기)
		const testMessage: IMessage = {
			roomId: "1",
			nickname: "test",
			message: "test입니다.",
			createdAt: new Date(),
			isMine: false,
			isSystem: true,
		};
		console.log(
			`producer message:\nroomId: ${testMessage.roomId}\nmessage: ${testMessage.message}\ncreatedAt: ${testMessage.createdAt}`
		);
		sendMessage(testMessage);
		// TEST END

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
