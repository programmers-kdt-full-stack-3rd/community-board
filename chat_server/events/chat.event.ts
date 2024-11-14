import { Producer } from "kafkajs";
import { RedisClientType } from "redis";
import { IMessage } from "shared";
import { Socket } from "socket.io";

import { sendMessage } from "../controllers/chat.controller";

/**
 * send_message 이벤트 핸들러
 * @param data
 * @param callback
 * @param socket
 * @param redisClient
 * @param kafkaProducer
 */
export const handleSendMessage = async (
	data: IMessage,
	callback: Function,
	socket: Socket,
	redisClient: RedisClientType,
	kafkaProducer: Producer
) => {
	try {
		const result = await sendMessage(
			data,
			socket,
			redisClient,
			kafkaProducer
		);

		callback({ success: true, data: result });
	} catch (error) {
		callback({ success: false, message: "메시지 전송 실패" });
	}
};
