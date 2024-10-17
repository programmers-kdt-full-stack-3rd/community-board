import {
	IEnterRoomResponse,
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
import { processMessage } from "../services/chat_service";
import { getMessages, setMessages } from "../services/redis_service";

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

				// redis 캐시 저장
				await setMessages(roomId, [message]);

				// kafka 시스템 메세지 저장
				await processMessage(message);

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
				response: {
					memberId: number;
					messageLogs: IMessage[];
				} | null
			) => void
		) => {
			try {
				// 쿠키
				const cookie = socket.handshake.headers.cookie!;

				// 멤버 ID
				const memIdData = await getMyMemberId({ roomId }, cookie);
				const { memberId } = memIdData.data;

				// 메시지 조회
				// console.time("message reading time");
				const messagesData = await getMessages(roomId); // Redis

				console.log(`messagesDataCount : ${messagesData.length}`);

				const messageLogsData =
					messagesData.length > 0
						? { data: { messageLogs: messagesData } }
						: await getMessageLogs({ roomId }, cookie); // Redis X
				const { messageLogs } = messageLogsData.data;
				// console.timeEnd("message reading time");

				console.log(`messagesLogDataCount : ${messageLogs.length}`);

				// 메시지 저장
				messagesData.length === 0 &&
					(await setMessages(roomId, messageLogs));

				callback({
					memberId,
					messageLogs: messageLogs.map(msg => ({
						...msg,
						isMine: memberId === msg.memberId,
					})),
				});
			} catch (error) {
				console.error(error);
				callback(null);
				socket.disconnect();
			}
		}
	);
};
