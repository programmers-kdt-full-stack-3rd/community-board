import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import { handleChatConnection } from "./controllers/chat_controller";
import { handleNotificationConnection } from "./controllers/notification_controller";
import { connectRedis } from "./config/redis_config";
import { connectProducer, sendMessage } from "./services/kafka_service"; // test 용
import { ISendMessageRequest } from "./types/message";

const app = express();
const httpServer = createServer(app);

dotenv.config();

// socket.io 서버 설정
const io = new Server(httpServer, {
	cors: {
		origin: "*",
		credentials: true,
	},
});

// socket.io admin-ui 설정
instrument(io, {
	auth: false,
	mode: "development",
});

// 네임스페이스 설정
const chatNamespace = io.of("/chat");
chatNamespace.on("connection", socket => {
	handleChatConnection(socket);
});

const notificationNamespace = io.of("/notifications");
notificationNamespace.on("connection", socket => {
	handleNotificationConnection(socket);
});

const PORT = process.env.PORT || 3000;

async function startServer() {
	try {
		// Redis 연결
		await connectRedis();
		console.log("Redis 연결 성공");

		// Kafka Producer 연결
		await connectProducer();
		console.log("Kafka Producer 연결 성공");

		// TEST: 추후 지울 것! (Kafka로 message 보내기)
		const testMessage: ISendMessageRequest = {
			roomId: "1",
			nickname: "test",
			message: "test입니다.",
			created_at: new Date(),
		};
		await sendMessage(testMessage);
		console.log(
			`socket server: roomId: ${testMessage.roomId} nickname: ${testMessage.nickname} message: ${testMessage.message} created_at: ${testMessage.created_at}`
		);

		// 채팅 서버 실행
		httpServer.listen(PORT, () => {
			console.log(`채팅 서버 ${PORT}에서 실행 중`);
		});
	} catch (error) {
		console.error("서버 시작 중 오류 발생:", error);
	}
}

// 서버 실행
startServer();
