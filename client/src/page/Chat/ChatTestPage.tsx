import { FC, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ChatRoom from "../../component/Chats/ChatRoom/ChatRoom";
import ChatRooms from "../../component/Chats/ChatRooms/ChatRooms";
import { useUserStore } from "../../state/store";

interface IRoomInfo {
	title: string;
	roomId: number;
}

const ChatPage: FC = () => {
	const navigate = useNavigate();

	const isLogin = useUserStore.use.isLogin();

	const [selectedRoom, setSelectedRoom] = useState<IRoomInfo | null>(null);

	useLayoutEffect(() => {
		if (!isLogin) {
			// TODO : aside로 개발 시 로그인 안되있음을 표시 및 로그인 페이지 바로가기 버튼 생성
			navigate(`/login?redirect=/chat`); // TEST: 로그인 페이지로 route
			return;
		}
	}, [isLogin, navigate]);

	return (
		<>
			{selectedRoom ? (
				<ChatRoom
					title={selectedRoom.title}
					roomId={selectedRoom.roomId}
					setSelectedRoom={setSelectedRoom}
				/>
			) : (
				<ChatRooms setSelectedRoom={setSelectedRoom} />
			)}
		</>
	);
};

export default ChatPage;
