import { Producer } from "kafkajs";
import { RedisClientType } from "redis";
import { IMessage } from "shared";
import { Socket } from "socket.io";

import { setMessages } from "./redis.service";

/**
 * 메시지 처리
 * @param data
 * @param socket
 * @param redisClient
 * @param kafkaProducer
 * @returns
 */
export const processMessage = async (
	data: IMessage,
	socket: Socket,
	redisClient: RedisClientType,
	kafkaProducer: Producer
) => {
	try {
		// 메시지 생성
		const message = {
			...data,
			createdAt: new Date(),
		};

		// 메시지 캐싱 및 처리
		await sendMessageToKafka(message, kafkaProducer);
		await setMessages(data.roomId, [message], redisClient);

		// 메시지 브로드캐스팅
		socket.to(`${data.roomId}`).emit("receive_message", data);

		return message;
	} catch (error) {
		console.error(error);
		throw new Error("메시지 처리 실패");
	}
};

/**
 * Kafka 메시지 전송 메서드
 * @param data
 * @param kafkaProducer
 */
export const sendMessageToKafka = async (
	data: IMessage,
	kafkaProducer: Producer
) => {
	try {
		console.log(data);
		await kafkaProducer.send({
			topic: "chat",
			messages: [
				{
					key: `${data.memberId}`, // member Id
					value: JSON.stringify({
						message: data.message,
						isSystem: data.isSystem,
					}), // message value (Buffer | string | null)
					timestamp: data.createdAt!.getTime().toString(), // string 형식의 시간 데이터
				},
			],
			acks: -1, // 리더와 모든 팔로워 파티션이 메시지를 기록했을 때 성공
			timeout: 10000, // ack에 대한 timeout
		});

		console.log(`메시지 전송 성공\ndata: ${data}`);
	} catch (error) {
		throw new Error("Kafka Producer message 전송 실패");
	}
};
