import { useEffect, useState } from "react";
import { container } from "./ChatRooms.css";
import { IGetMyRoomRequestEvent, IRoomHeader } from "shared";
import CreateRoomModal from "./Modal/CreateRoomModal";
import MyChatRooms from "./MyChatRooms";
import SearchedChatRooms from "./SearchedChatRooms";
import { useUserStore } from "../../../state/store";

export interface RoomsInfo {
	totalRoomCount: number;
	rooms: {
		[key: number]: IRoomHeader[];
	};
	// key : 현재 page
	// values : 현재 page에서 보여 줄 채팅방 정보
}

const ChatRooms = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const isAsideOpen = true; // TODO : Aside UI 만들때 State 관리
	const nickname = useUserStore(state => state.nickname);
	const socket = useUserStore.use.socket();

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
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
			/>
		</div>
	);
};

export default ChatRooms;
