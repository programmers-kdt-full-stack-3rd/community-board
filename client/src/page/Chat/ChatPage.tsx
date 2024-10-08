import { FC, useState } from "react";
import ChatRoom from "../../component/Chats/ChatRoom/ChatRoom";
import ChatRooms from "../../component/Chats/ChatRooms/ChatRooms";
import { ChatPageStyle } from "./ChatPage.css";

interface IRoomInfo {
	title: string;
	roomId: number;
}

const ChatPage: FC = () => {
	const [selectedRoom, setSelectedRoom] = useState<IRoomInfo | null>(null);

	return (
		<div className={ChatPageStyle}>
			{selectedRoom ? (
				<ChatRoom
					title={selectedRoom.title}
					roomId={selectedRoom.roomId}
					setSelectedRoom={setSelectedRoom}
				/>
			) : (
				<ChatRooms setSelectedRoom={setSelectedRoom} />
			)}
		</div>
	);
};

export default ChatPage;
