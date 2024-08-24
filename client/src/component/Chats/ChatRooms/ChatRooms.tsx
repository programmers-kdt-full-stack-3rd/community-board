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
	// key : 현재 page
	// values : 현재 page에서 보여 줄 채팅방 정보
}

interface ChatRoomsProps {
	socket: Socket | null;
}

const ChatRooms: FC<ChatRoomsProps> = ({ socket }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const isAsideOpen = true; // TODO : Aside UI 만들때 State 관리
	const nickname = useUserStore(state => state.nickname);

	useEffect(() => {
		if (isAsideOpen) {
			console.log(currentPage);
			const data: IGetMyRoomRequestEvent = {
				page: currentPage,
				nickname,
			};
			socket?.emit("get_my_rooms", data);
		}
	}, [isAsideOpen, socket, currentPage]);

	return (
		<div className={container}>
			{isOpen ? <CreateRoomModal close={setIsOpen} /> : null}
			<SearchedChatRooms open={setIsOpen} />
			<MyChatRooms
				socket={socket}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
			/>
		</div>
	);
};

export default ChatRooms;
