import { Socket } from "socket.io";
import { handleNotificationEvents } from "../events/notification_events";

export const handleNotificationConnection = (socket: Socket) => {
	console.log(`새로운 클라이언트 알림 접속 : ${socket.id}`);

	handleNotificationEvents(socket);

	socket.on("disconnect", () => {
		console.log(`클라이언트 알림 연결해제 : ${socket.id}`);
	});
};
