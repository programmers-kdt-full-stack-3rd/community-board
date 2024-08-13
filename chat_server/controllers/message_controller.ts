import { Socket } from "socket.io";
import { getMessageLogs, sendMessage } from "../services/message_service";

// 일단 서비스 함수 파라미터 roomName, message으로 작성
// TODO : DTO기반 수정

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
