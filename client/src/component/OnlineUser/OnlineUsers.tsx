import {
	onlineUserContainer,
	onlineUserList,
	onlineUserTitle,
} from "./OnlineUsers.css";
import OnlineUserItem from "./OnlineUserItem/OnlineUserItem";
import { useUserStore } from "../../state/store";
import { useEffect, useLayoutEffect, useState } from "react";

const OnlineUsers = () => {
	const socket = useUserStore.use.socket();
	const isLogin = useUserStore.use.isLogin();
	const [onlineUsers, setOnlineUsers] = useState<string[] | null>(null);

	useLayoutEffect(() => {
		if (socket) {
			socket.emit("request_online_users");

			socket.on("receive_online_users", (users: string[]) => {
				console.log("Initial online users:", users);
				setOnlineUsers(users);
			});
		}

		return () => {
			if (socket) {
				socket.off("receive_online_users");
			}
		};
	}, [socket]);

	useEffect(() => {
		if (socket) {
			socket.on("update_online_users", (res: string[]) => {
				console.log("res : ", res);
				setOnlineUsers(res);
			});
			console.log("setOnlineUsers : ", onlineUsers);

			return () => {
				socket.off("update_online_users");
			};
		}

		if (!isLogin) {
			setOnlineUsers(null);
		}
	}, [socket, isLogin]);

	return (
		<div className={onlineUserContainer}>
			<div className={onlineUserTitle}>접속 현황</div>
			<div className={onlineUserList}>
				{onlineUsers?.map((nickname, index) => (
					<OnlineUserItem
						key={index}
						nickname={nickname}
					/>
				))}
			</div>
		</div>
	);
};
export default OnlineUsers;
