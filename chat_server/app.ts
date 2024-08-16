import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import { handleChatConnection } from "./controllers/chat_controller";
import { handleNotificationConnection } from "./controllers/notification_controller";

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

const PORT = process.env.PORT;
httpServer.listen(PORT, () => {
	console.log(`채팅 서버 ${PORT}에서 실행 중`);
});
