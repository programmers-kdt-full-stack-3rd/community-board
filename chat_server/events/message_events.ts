import { IKafkaMessageDTO, IMessage, ISocketMessageDTO } from "shared";
import { Socket } from "socket.io";

import { processMessage } from "../services/chat_service";
import { setMessages } from "../services/redis_service";

// 메세지 이벤트
export const handleMessageEvents = (socket: Socket) => {
	socket.on("send_message", async (message: ISocketMessageDTO, callback) => {
		try {
			const roomId = message.roomId;
			const createdAt = new Date(message.createdAt);
			const msg: IKafkaMessageDTO = {
				...message,
				createdAt,
			};
			const redisMessage: IMessage = {
				...message,
				createdAt,
				isSystem: false,
			};

			await processMessage(msg);
			callback(true);

			await setMessages(roomId, [redisMessage]);

			const receiveMsg: IMessage = {
				...message,
				createdAt,
				isMine: false,
			};
			socket.to(`${message.roomId}`).emit("receive_message", receiveMsg);
		} catch (err) {
			console.log(err);
			callback(false);
		}
	});
};
