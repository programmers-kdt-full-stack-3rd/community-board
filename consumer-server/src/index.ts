import dotenv from "dotenv";

import { getKafkaAPI, initKafkaAPI } from "./config/kafkaConfig";
import {
	getConsumer,
	initConsumer,
	processMessage,
} from "./services/kafkaService";

dotenv.config();

const startServer = async () => {
	// 도커 호스트 IP
	const DOCKER_HOST_IP = process.env.DOCKER_HOST_IP;

	// 카프카 PORT
	const KAFKA_PORT_1 = process.env.KAFKA_PORT_1;
	const KAFKA_PORT_2 = process.env.KAFKA_PORT_2;
	const KAFKA_PORT_3 = process.env.KAFKA_PORT_3;

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
		// Kafka API
		initKafkaAPI("chat-group1-consumer1", brokers);
		const kafka = getKafkaAPI();

		// Kafka Consumer
		initConsumer(kafka, "chat-group1");
		const consumer = getConsumer();

		// Kafka Consumer 연결
		await consumer.connect();
		console.log("Kafka Consumer 연결 성공");

		// Kafka Consumer chat 구독
		await consumer.subscribe({ topic: "chat", fromBeginning: false });
		console.log("Kafka Chat 구독 성공");

		// Kafka Consumer Message 수신 처리
		await consumer.run({
			eachMessage: processMessage,
		});
		console.log("Kafka Consumer 메시지 수신 중");
	} catch (error) {
		console.error("Error starting the Kafka Consumer", error);
	}
};

startServer();
