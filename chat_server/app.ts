import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import { handleSocketConnection } from "./controllers/socket_controller";

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

io.on("connection", (socket: Socket) => {
	handleSocketConnection(socket);
});

const PORT = process.env.PORT;
httpServer.listen(PORT, () => {
	console.log(`채팅 서버 ${PORT}에서 실행 중`);
});
