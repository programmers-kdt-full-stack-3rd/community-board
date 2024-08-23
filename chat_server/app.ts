import cookie from "cookie";
import { createServer } from "http";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";

import { instrument } from "@socket.io/admin-ui";

import { handleChatConnection } from "./controllers/chat_controller";
import { handleNotificationConnection } from "./controllers/notification_controller";
import { Socket } from "dgram";

const httpServer = createServer();

// socket.io 서버 설정
const io = new Server(httpServer, {
	cors: {
		origin: process.env.API_SERVER_ADDRESS || "http://localhost:8000",
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
chatNamespace.use((socket, next) => {
	const cookieString = socket.handshake.headers.cookie;

	if (cookieString === undefined) {
		socket.disconnect();
		return;
	}

	const cookies = cookie.parse(cookieString!) as {
		refreshToken: string;
		accessToken: string;
	};

	const { userId } = jwt.decode(cookies.refreshToken) as { userId: number };
	(socket as unknown as Socket & { userId: number }).userId = userId;
	next();
});
chatNamespace.on("connection", socket => {
	handleChatConnection(socket);
});

const notificationNamespace = io.of("/notifications");
notificationNamespace.on("connection", socket => {
	handleNotificationConnection(socket);
});

export default httpServer;
