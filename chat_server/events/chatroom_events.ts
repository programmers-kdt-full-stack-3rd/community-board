import {
	IEnterRoomResponse,
	IGetRoomMessageLogsResponse,
	IJoinRoomRequest,
	IJoinRoomResponse,
	IMessage,
	IReadRoomRequest,
	IRoomHeader,
} from "shared";
import { Socket } from "socket.io";

import {
	getMessageLogs,
	getMyMemberId,
	getMyRoomsToApi,
	joinRoomToApi,
} from "../utils/api";
import { sendMessage } from "../services/kafka_service";

// 채팅방 이벤트
export const handleRoomEvents = (socket: Socket) => {
	socket.on("get_my_rooms", async (data: IReadRoomRequest) => {
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
	socket.on(
		"join_room",
		async (
			data: IJoinRoomRequest,
			callback: (isSuccess: boolean) => void
		) => {
			try {
				// 채팅방 가입
				const joinData = await joinRoomToApi(
					data,
					socket.handshake.headers.cookie!
				);
				const { roomId } = joinData.data as IJoinRoomResponse;

				// 멤버 ID
				const memIdData = await getMyMemberId(
					{
						roomId,
					},
					socket.handshake.headers.cookie!
				);
				const { memberId } = memIdData.data as IEnterRoomResponse;

				// system 메시지
				const message: IMessage = {
					memberId,
					roomId,
					nickname: data.nickname!,
					message: `${data.nickname}님이 가입했습니다.`,
					createdAt: new Date(),
					isSystem: true,
					isMine: false,
				};

				// kafka 시스템 메세지 저장
				await sendMessage(message);

				// join room
				socket.join(`${roomId}`);

				callback(true);

				socket.to(`${data.roomId}`).emit("receive_message", message);
			} catch (error) {
				console.error(error);
				callback(false);
			}
		}
	);

	// 채팅방 입장
	socket.on(
		"enter_room",
		async (
			roomId: number,
			callback: (
				response:
					| {
							memberId: number;
							messageLogs: IMessage[];
					  }
					| boolean
			) => void
		) => {
			try {
				// 멤버 ID
				const memIdData = await getMyMemberId(
					{
						roomId,
					},
					socket.handshake.headers.cookie!
				);

				// TODO : 캐싱 메시지 조회(redis -> http)

				const { memberId } = memIdData.data as IEnterRoomResponse;

				// 채팅 내역
				const messageLogsData = await getMessageLogs(
					{
						roomId,
					},
					socket.handshake.headers.cookie!
				);

				const { messageLogs } =
					messageLogsData.data as IGetRoomMessageLogsResponse;

				callback({
					memberId,
					messageLogs: messageLogs.map(msg => ({
						...msg,
						isMine: memberId === msg.memberId,
					})),
				});
			} catch (error) {
				console.error(error);
				callback(false);
				socket.disconnect();
			}
		}
	);
};
