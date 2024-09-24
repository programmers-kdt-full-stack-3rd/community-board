import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie";

export const authMiddleware = (io: any) => (socket: Socket, next: any) => {
	try {
		const cookieString = socket.handshake.headers.cookie;

		if (!cookieString) {
			socket.disconnect;
			return next(new Error("사용자 쿠키를 찾을 수 없습니다."));
		}

		const cookies = cookie.parse(cookieString) as {
			accessToken: string;
			refreshToken: string;
		};

		const { userId } = jwt.decode(cookies.refreshToken) as {
			userId: number;
		};

		(socket as any).userId = userId;

		next();
	} catch (error) {
		console.error("Authentication error:", error);
		next(new Error("Authentication error"));
	}
};
