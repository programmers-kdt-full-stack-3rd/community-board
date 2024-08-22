import { FC, useEffect, useState } from "react";
import { container } from "./ChatRooms.css";
import { IGetMyRoomRequestEvent, IRoomHeader } from "shared";
import CreateRoomModal from "./Modal/CreateRoomModal";
import MyChatRooms from "./MyChatRooms";
import SearchedChatRooms from "./SearchedChatRooms";
import { Socket } from "socket.io-client";
import { useUserStore } from "../../../state/store";

export interface RoomsInfo {
	totalRoomCount: number;
	rooms: {
		[key: number]: IRoomHeader[];
	};
}

interface ChatRoomsProps {
	socket: Socket | null;
}

const ChatRooms: FC<ChatRoomsProps> = ({ socket }) => {
	const [isOpen, setIsOpen] = useState(false);
	const isAsideOpen = true; // TODO : Aside UI 만들때 State 관리
	const nickname = useUserStore(state => state.nickname);

	useEffect(() => {
		if (isAsideOpen) {
			const data: IGetMyRoomRequestEvent = { nickname };
			socket?.emit("get_my_rooms", data);
		}
	}, [isAsideOpen, socket]);

	return (
		<div className={container}>
			{isOpen ? <CreateRoomModal close={setIsOpen} /> : null}
			<SearchedChatRooms open={setIsOpen} />
			<MyChatRooms socket={socket} />
		</div>
	);
};

export default ChatRooms;
