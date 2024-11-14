import { Producer } from "kafkajs";
import { RedisClientType } from "redis";
import { IMessage } from "shared";
import { Socket } from "socket.io";

import { processMessage } from "../services/chat.service";

export const sendMessage = async (
	data: IMessage,
	socket: Socket,
	redisClient: RedisClientType,
	kafkaProducer: Producer
) => {
	try {
		const message = await processMessage(
			data,
			socket,
			redisClient,
			kafkaProducer
		);

		return message;
	} catch (error) {
		throw error;
	}
};
