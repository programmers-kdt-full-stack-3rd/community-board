import { IKafkaMessageDTO, IMessage, ISocketMessageDTO } from "shared";
import { Socket } from "socket.io";

import { sendMessage } from "../services/kafka_service";

// 메세지 이벤트
export const handleMessageEvents = (socket: Socket) => {
	socket.on("send_message", async (message: ISocketMessageDTO, callback) => {
		const createdAt = new Date(message.createdAt);

		const msg: IKafkaMessageDTO = {
			...message,
			createdAt,
		};

		try {
			await sendMessage(msg);
			callback(true);

			// TODO : 캐시 저장

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
