import { Producer } from "kafkajs";
import { RedisClientType } from "redis";
import { Socket } from "socket.io";
import {
	IEnterRoomRequest,
	IEnterRoomResponse,
	IJoinRoomRequest,
	IJoinRoomResponse,
	IReadRoomRequest,
	IReadRoomResponse,
} from "shared";

import { getMessageLogs, processSystemMessage } from "../services/room.service";
import { getMyRoomsToApi, joinRoomToApi, getMyMemberId } from "../utils/api";

// 내 채팅방 조회
export const getMyRooms = async (
	data: IReadRoomRequest,
	socket: Socket
): Promise<IReadRoomResponse> => {
	try {
		// 내 채팅방 조회 API 호출
		const response = await getMyRoomsToApi(data, socket.data.cookies);
		return response.data;
	} catch (error) {
		throw error;
	}
};

// 채팅방 가입
export const joinRoom = async (
	data: IJoinRoomRequest,
	socket: Socket,
	redisClient: RedisClientType,
	kafkaProducer: Producer
): Promise<IJoinRoomResponse> => {
	try {
		// 채팅방 가입 API 호출
		const response = await joinRoomToApi(data, socket.data.cookies);

		// 시스템 메시지 처리
		await processSystemMessage(
			response.data.roomId,
			data.nickname,
			socket,
			redisClient,
			kafkaProducer
		);

		return response.data;
	} catch (error) {
		throw error;
	}
};

export const enterRoom = async (
	data: IEnterRoomRequest,
	socket: Socket,
	redisClient: RedisClientType
) => {
	try {
		// memberId 조회 (memberId 프론트에서 가지고 있을 필요가 있어보임.)
		const response = await getMyMemberId(data, socket.data.cookies);

		// 채팅 내역 조회
		const messageLogs = await getMessageLogs(
			data.roomId,
			response.data.memberId,
			socket,
			redisClient
		);

		return { memberId: response.data.memberId, messageLogs };
	} catch (error) {
		throw error;
	}
};
