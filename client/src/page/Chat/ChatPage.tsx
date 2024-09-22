import { FC, useState } from "react";
import ChatRoom from "../../component/Chats/ChatRoom/ChatRoom";
import ChatRooms from "../../component/Chats/ChatRooms/ChatRooms";

interface IRoomInfo {
	title: string;
	roomId: number;
}

const ChatPage: FC = () => {
	const [selectedRoom, setSelectedRoom] = useState<IRoomInfo | null>(null);

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
