import cookie from "cookie";
import jwt from "jsonwebtoken";
import { Socket } from "socket.io";

export const validateCookie = (socket: Socket, next: (err?: any) => void) => {
	const cookies = socket.handshake.headers.cookie;

	if (!cookies) {
		socket.disconnect();
		return;
	}

	const { refreshToken } = cookie.parse(cookies);
	const { userId } = jwt.decode(refreshToken) as { userId: number };

	socket.data.cookies = cookies;
	socket.data.userId = userId;

	next();
};
