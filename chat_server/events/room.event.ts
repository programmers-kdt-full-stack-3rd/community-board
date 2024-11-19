import { Producer } from "kafkajs";
import { RedisClientType } from "redis";
import {
	IEnterRoomRequest,
	IJoinRoomRequest,
	IReadRoomRequest,
	IRoomHeader,
} from "shared";
import { Socket } from "socket.io";

import {
	enterRoom,
	getMyRooms,
	joinRoom,
} from "../controllers/room.controller";

/**
 * get_my_rooms 이벤트 핸들러
 * @param data
 * @param callback
 * @param socket
 */
export const handleGetMyRooms = async (
	data: IReadRoomRequest,
	callback: Function,
	socket: Socket
) => {
	try {
		// 채팅방 조회
		const result = await getMyRooms(data, socket);

		result.roomHeaders.forEach((room: IRoomHeader) => {
			socket.join(room.roomId.toString());
		});

		callback({ success: true, data: result });
	} catch (error) {
		console.log(error);
		callback({ success: false, message: "조회 실패" });
	}
};

/**
 * join_room 이벤트 핸들러
 * @param data
 * @param callback
 * @param socket
 * @param redisClient
 * @param kafkaProducer
 */
export const handleJoinRoom = async (
	data: IJoinRoomRequest,
	callback: Function,
	socket: Socket,
	redisClient: RedisClientType,
	kafkaProducer: Producer
) => {
	try {
		// 채팅방 가입
		const result = await joinRoom(data, socket, redisClient, kafkaProducer);

		// 소켓 채팅방 가입
		socket.join(`${result.roomId}`);

		// 성공 메시지 처리
		callback({ success: true, data: result });
	} catch (error) {
		callback({ success: false, message: "가입 실패" });
	}
};

/**
 * enter_room 이벤트 핸들러
 * @param data
 * @param callback
 * @param socket
 * @param redisClient
 */
export const handleEnterRoom = async (
	data: IEnterRoomRequest,
	callback: Function,
	socket: Socket,
	redisClient: RedisClientType
) => {
	try {
		// 채팅방 입장
		const result = await enterRoom(data, socket, redisClient);

		callback({ success: true, data: result });
	} catch (error) {
		callback({ success: false, message: "입장 실패" });
	}
};
