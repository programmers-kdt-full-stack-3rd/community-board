import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import { handleChatConnection } from "./controllers/chat_controller";
import { handleNotificationConnection } from "./controllers/notification_controller";

const app = express();
const httpServer = createServer(app);

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

export default httpServer;
