import { Socket } from "socket.io";
import { getMessageLogs, sendMessage } from "../services/message_service";

// 메세지 이벤트
export const handleMessageEvents = (socket: Socket) => {
	socket.on("send_message", (roomName, message) => {
		sendMessage(socket, roomName, message);
		socket.to(roomName).emit("receive_message", message);
	});

	socket.on("message_logs", roomName => {
		const logs = getMessageLogs(roomName);
		socket.emit("message_logs", logs);
	});
};
