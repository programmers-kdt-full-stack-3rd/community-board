import { Socket } from "socket.io";

const onlineUsers = new Set<String>();

export const handleOnlineUserEvents = (socket: Socket) => {
	socket.on("request_online_users", () => {
		socket.emit("receive_online_users", Array.from(onlineUsers));
	});

	socket.on("update_online_users", async (nickname: string) => {
		console.log("data:", nickname);
		if (nickname) {
			onlineUsers.add(nickname);
			socket.broadcast.emit(
				"update_online_users",
				Array.from(onlineUsers)
			);
			console.log("online_user_list ", Array.from(onlineUsers));
		}
	});

	socket.on("logout", (nickname: string) => {
		if (nickname && onlineUsers.has(nickname)) {
			onlineUsers.delete(nickname);
			socket.emit("update_online_users", Array.from(onlineUsers));
			socket.broadcast.emit(
				"update_online_users",
				Array.from(onlineUsers)
			);
		}
	});
};
