import { FC, useState } from "react";
import { container } from "./ChatRooms.css";
import { IRoomHeader } from "shared";
import CreateRoomModal from "./Modal/CreateRoomModal";
import MyChatRooms from "./MyChatRooms";
import SearchedChatRooms from "./SearchedChatRooms";

export interface RoomsInfo {
	totalRoomCount: number;
	rooms: {
		[key: number]: IRoomHeader[];
	};
	// key : 현재 page
	// values : 현재 page에서 보여 줄 채팅방 정보
}

const ChatRooms: FC = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className={container}>
			{isOpen ? <CreateRoomModal close={setIsOpen} /> : null}
			<SearchedChatRooms open={setIsOpen} />
			<MyChatRooms />
		</div>
	);
};

export default ChatRooms;
