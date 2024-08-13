import { Socket } from "socket.io";

// TODO : DTO기반 타입 적용

export const sendMessage = (
	socket: Socket,
	roomName: string,
	message: string
) => {
	// TODO
};

export const getMessageLogs = (roomName: string) => {
	// TODO
};
