import { Socket } from "socket.io";
import { IGetMyRoomRequestEvent, IReadRoomRequest, IRoomHeader } from "shared";
import { getMyRoomsToApi } from "../utils/api";

// 채팅방 이벤트
export const handleRoomEvents = (socket: Socket) => {
	socket.on("get_my_rooms", async (data: IGetMyRoomRequestEvent) => {
		console.log("get_my_room 이벤트 on");

		// API 요청을 위해 IReadRoomRequest 타입 데이터
		// TODO : IReadRoomRequest 데이터 "?:" 로 수정.
		const requestData: IReadRoomRequest = {
			page: 1,
			perPage: 4,
			isSearch: false,
			keyword: "",
		};

		try {
			const response = await getMyRoomsToApi(requestData);
			socket.emit("get_my_rooms", response.data);
			console.log(response.data);

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
};
