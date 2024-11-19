import { createServer } from "http";
import { Server } from "socket.io";

import { port, socket } from "./config/index";
import { handleSendMessage } from "./events/chat.event";
import {
	handleEnterRoom,
	handleGetMyRooms,
	handleJoinRoom,
} from "./events/room.event";
import { validateCookie } from "./middlewares/auth.middleware";
import { initKafkaProducer } from "./utils/kafka";
import { initRedis } from "./utils/redis";

const startServer = async () => {
	try {
		// Redis & Kafka 초기화
		const redisClient = await initRedis();
		const kafkaProducer = await initKafkaProducer();

		// 소켓 서버 생성
		const httpServer = createServer();
		const io = new Server(httpServer, socket.options);

		// 미들웨어 등록
		io.use(validateCookie);

		// 이벤트 등록
		io.on("connection", socket => {
			// 내 채팅방 조회
			socket.on("get_my_rooms", (data, callback) =>
				handleGetMyRooms(data, callback, socket)
			);

			// 채팅방 가입
			socket.on("join_room", (data, callback) =>
				handleJoinRoom(
					data,
					callback,
					socket,
					redisClient,
					kafkaProducer
				)
			);

			// 채팅방 입장
			socket.on("enter_room", (data, callback) =>
				handleEnterRoom(data, callback, socket, redisClient)
			);

			// 채팅 전송
			socket.on("send_message", (data, callback) => {
				handleSendMessage(
					data,
					callback,
					socket,
					redisClient,
					kafkaProducer
				);
			});
		});

		// 서버 실행
		httpServer.listen(port, () => {
			console.log(`채팅 서버 ${port}에서 실행 중`);
		});
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

startServer();
