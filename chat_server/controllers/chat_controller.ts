import { Socket } from "socket.io";
import { handleRoomEvents } from "./chatroom_controller";
import { handleMessageEvents } from "./message_controller";

export const handleChatConnection = (socket: Socket) => {
	console.log(`새로운 클라이언트 채팅 접속 : ${socket.id}`);

	handleRoomEvents(socket);
	handleMessageEvents(socket);

	socket.on("disconnect", () => {
		console.log(`클라이언트 채팅 연결해제 : ${socket.id}`);
	});
};
