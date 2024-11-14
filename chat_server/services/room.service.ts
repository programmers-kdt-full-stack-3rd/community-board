import { Producer } from "kafkajs";
import { RedisClientType } from "redis";
import { Socket } from "socket.io";

import { processMessage } from "./chat.service";
import { getMessages, setMessages } from "./redis.service";

import { getMessageLogsToApi } from "../utils/api";

/**
 * 시스템 메시지 처리
 * @param roomId
 * @param nickname
 * @param socket
 * @param redisClient
 * @param kafkaProducer
 */
export const processSystemMessage = async (
	roomId: number,
	nickname: string,
	socket: Socket,
	redisClient: RedisClientType,
	kafkaProducer: Producer
) => {
	try {
		// 시스템 메시지 생성
		const message = {
			memberId: 1, // 기억이 안나서 memberId 뭐로 하기로 했더라?
			roomId,
			nickname,
			message: `${nickname}님이 가입했습니다.`,
			isSystem: true,
		};

		// 메시지 처리
		await processMessage(message, socket, redisClient, kafkaProducer);
	} catch (error) {
		throw new Error("시스템 메시지 처리 실패");
	}
};

/**
 * 채팅 내역 조회
 * @param roomId
 * @param memberId
 * @param socket
 * @param redisClient
 * @returns
 */
export const getMessageLogs = async (
	roomId: number,
	memberId: number,
	socket: Socket,
	redisClient: RedisClientType
) => {
	// Redis에서 채팅 내역 조회
	let messageLogs = await getMessages(roomId, redisClient);

	// Redis에서 없을 시 API로 조회
	if (messageLogs.length === 0) {
		const response = await getMessageLogsToApi(
			{ roomId },
			socket.data.cookies
		);

		messageLogs = response.data.messageLogs;

		// 캐시 저장
		await setMessages(roomId, response.data.messageLogs, redisClient);
	}

	// isMine 설정(memberId 프론트에 있을 경우 수정 필요)
	return messageLogs.map(log => ({
		...log,
		isMine: memberId === log.memberId,
	}));
};
