import {
	IGetRoomMessageLogsResponse,
	IGetMyRoomRequestEvent,
	IReadRoomRequest,
	IRoomHeader,
	IJoinRoomRequest,
	IJoinRoomResponse,
	IKafkaMessageDTO,
	IMessage,
	IJoinRoomRequestEvent,
} from "shared";
import { Socket } from "socket.io";

import { sendMessage } from "../services/kafka_service";
import { getMessageLogs, getMyRoomsToApi, joinRoomToApi } from "../utils/api";

// 채팅방 이벤트
export const handleRoomEvents = (socket: Socket) => {
	socket.on("get_my_rooms", async (data: IGetMyRoomRequestEvent) => {
		const requestData: IReadRoomRequest = {
			page: data.page,
			perPage: 2,
			isSearch: false,
			keyword: "",
		};

		try {
			const response = await getMyRoomsToApi(
				requestData,
				socket.handshake.headers.cookie!
			);
			socket.emit("get_my_rooms", response.data);
			// console.log(response.data);

			// 내가 속한 채팅방 socket.join
			response.data.roomHeaders.forEach((room: IRoomHeader) => {
				const roomId = room.roomId.toString();
				socket.join(roomId);
			});
		} catch (error) {
			console.error("Error fetching chat rooms:", error);
			socket.emit("my_rooms_error", {
				message: "Failed to retrieve chat rooms",
			});
		}
	});

	// 채팅방 가입
	socket.on("join_room", async (data: IJoinRoomRequestEvent) => {
		console.log("join_room 이벤트 데이터: ", data);
		try {
			// BUG: 현재 API 에러!!
			// const response = await joinRoomToApi(
			// 	data,
			// 	socket.handshake.headers.cookie!
			// );

			// TEST: API 응답 가정(roomId 상수값)
			const testResponse: IJoinRoomResponse = {
				roomId: data.roomId,
			};
			const roomId = testResponse.roomId.toString();
			socket.join(roomId);

			// 1. message DB에 저장(kafka)
			const createdAt = new Date();
			const joinMessage = `${data.nickname}가 입장했습니다.`;

			const msg: IKafkaMessageDTO = {
				roomId: testResponse.roomId,
				userId: (socket as unknown as Socket & { userId: number })
					.userId,
				message: joinMessage,
				createdAt, // 생성 시간
				isSystem: true, // 시스템 메시지 유무
			};

			const receiveMsg: IMessage = {
				...msg,
				isMine: false,
			};

			try {
				// kafka 시스템 메세지 저장
				await sendMessage(msg);

				// TODO : 캐시 저장

				console.log("kafka 시스템 메세지 저장 성공");
				socket.broadcast.to(roomId).emit("receive_message", receiveMsg);
				// join_result
				const isSuccess = true;
				socket.emit("join_result", isSuccess);
			} catch (error) {
				console.error(
					"Error sending message or broadcasting to room:",
					error
				);
			}
		} catch (error) {
			console.error("Error fetching join room:");
		}
	});

	// 채팅방 입장
	socket.on(
		"enter_room",
		async (roomId: number, callback: (msgs: IMessage[]) => void) => {
			try {
				// TODO : 캐싱 메시지 조회(redis -> http)

				const response = await getMessageLogs({
					roomId,
				});

				const { messageLogs } =
					response.data as IGetRoomMessageLogsResponse;

				callback(messageLogs);
			} catch (error) {
				console.error(error);
				socket.disconnect();
			}
		}
	);
};
