import dotenv from "dotenv";

import { getDBPool, initDBPool } from "./config/dbConfig";
import { getKafkaAPI, initKafkaAPI } from "./config/kafkaConfig";
import {
	getConsumer,
	initConsumer,
	processMessage,
} from "./services/kafkaService";

dotenv.config();

const startServer = async () => {
	// 호스트 IP
	const HOST_IP = process.env.DOCKER_HOST_IP || "localhost";

	// DB PORT
	const DB_PORT = parseInt(process.env.DB_PORT || "3306");

	// DB config
	const DB_USER = process.env.DB_USER || "root";
	const DB_PSWORD = process.env.DB_PSWORD || "root";
	const DB_NAME = process.env.DB_USER || "community_board";

	// 카프카 PORT
	const KAFKA_PORT_1 = process.env.KAFKA_PORT_1 || "9092";
	const KAFKA_PORT_2 = process.env.KAFKA_PORT_2 || "9093";
	const KAFKA_PORT_3 = process.env.KAFKA_PORT_3 || "9094";

	// Broker URLs
	const brokers: string[] = [
		`${HOST_IP}:${KAFKA_PORT_1}`,
		`${HOST_IP}:${KAFKA_PORT_2}`,
		`${HOST_IP}:${KAFKA_PORT_3}`,
	];

	try {
		// Kafka API 초기화
		initKafkaAPI("chat-group1-consumer1", brokers);
		const kafka = getKafkaAPI();

		// Kafka Consumer 초기화
		initConsumer(kafka, "chat-group1");
		const consumer = getConsumer();

		// DB Pool 생성
		initDBPool({
			host: HOST_IP,
			port: DB_PORT,
			user: DB_USER,
			database: DB_NAME,
			password: DB_PSWORD,
		});

		// DB 연결 테스트
		const pool = getDBPool();
		const conn = await pool.getConnection();
		console.log("DB 연결 성공");
		conn.release();

		// Kafka Consumer 연결
		await consumer.connect();
		console.log("Kafka Consumer 연결 성공");

		// Kafka Consumer chat 구독
		await consumer.subscribe({ topic: "chat", fromBeginning: false });
		console.log("Kafka Chat 구독 성공");

		// Kafka Consumer Message 수신 연결
		await consumer.run({
			eachMessage: processMessage,
		});
		console.log("Kafka Consumer 메시지 수신 중...");
	} catch (error) {
		console.error("Error starting the Kafka Consumer", error);
	}
};

startServer();
