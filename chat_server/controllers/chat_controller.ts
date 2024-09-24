import { Socket } from "socket.io";
import { handleRoomEvents } from "../events/chatroom_events";
import { handleMessageEvents } from "../events/message_events";
import { handleOnlineUserEvents } from "../events/online_user_events";

export const handleChatConnection = (socket: Socket) => {
	console.log(`새로운 클라이언트 채팅 접속 : ${socket.id}`);

	handleOnlineUserEvents(socket);

	handleRoomEvents(socket);
	handleMessageEvents(socket);

	socket.on("disconnect", () => {
		console.log(`클라이언트 채팅 연결해제 : ${socket.id}`);
	});
};
