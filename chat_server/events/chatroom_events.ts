import { Socket } from "socket.io";
import { IGetRoomMessageLogsResponse } from "shared";

import {
	createRoom,
	getRooms,
	joinRoom,
	leaveRoom,
} from "../services/chatroom_service";
import { httpRequest } from "../services/api_service";

// 일단 서비스 함수 파라미터 roomName으로 작성

// 채팅방 이벤트
export const handleRoomEvents = (socket: Socket) => {
	socket.on("get_rooms", () => {
		const rooms = getRooms();
		socket.emit("rooms_list", rooms);
	});

	socket.on("create_room", roomName => {
		createRoom(roomName);
		socket.emit("room_created", roomName);
	});

	socket.on("join_room", roomName => {
		joinRoom(socket, roomName);
		socket.join(roomName);
		socket.to(roomName).emit("user_joined", socket.id);
	});

	socket.on("leave_room", roomName => {
		leaveRoom(socket, roomName);
		socket.leave(roomName);
		socket.to(roomName).emit("user_left", socket.id);
	});

	// 채팅방 입장
	socket.on("enter_room", async (roomId, callback) => {
		socket.join(`${roomId}`); // TEST : join room

		// TODO : 캐싱 메시지 조회(redis -> http)

		const { messageLogs }: IGetRoomMessageLogsResponse = await httpRequest(
			`api/chat/room/${roomId}`,
			"GET",
			{}
		);

		callback(messageLogs);
	});
};
