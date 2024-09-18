import { FC, useLayoutEffect, useState } from "react";
import { container } from "./ChatRooms.css";
import { IGetMyRoomRequestEvent, IRoomHeader } from "shared";
import CreateRoomModal from "./Modal/CreateRoomModal";
import MyChatRooms from "./MyChatRooms";
import SearchedChatRooms from "./SearchedChatRooms";
import { useUserStore } from "../../../state/store";
import { useNavigate } from "react-router-dom";
import ChatHeader from "./ChatHeader";
import { ChatAsideCategory, useChatAside } from "../../../state/ChatAsideStore";

export interface RoomsInfo {
	totalRoomCount: number;
	rooms: {
		[key: number]: IRoomHeader[];
	};
	// key : 현재 page
	// values : 현재 page에서 보여 줄 채팅방 정보
}

interface Props {
	setSelectedRoom: (room: { title: string; roomId: number }) => void;
}

const ChatRooms: FC<Props> = ({ setSelectedRoom }) => {
	const navigate = useNavigate(); // TEST : 채팅방 페이지

	const [isOpen, setIsOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState<number>(1);
	// const isAsideOpen = true; // TODO : Aside UI 만들때 State 관리

	// 전역 상태
	const isLogin = useUserStore.use.isLogin();
	const nickname = useUserStore.use.nickname();
	const socket = useUserStore.use.socket();
	const { category } = useChatAside();

	const renderChatRoomPage = () => {
		switch (category) {
			case ChatAsideCategory.SEARCH:
				return (
					<SearchedChatRooms
						open={setIsOpen}
						setSelectedRoom={setSelectedRoom}
					/>
				);
			case ChatAsideCategory.MYROOM:
				return (
					<MyChatRooms
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						setSelectedRoom={setSelectedRoom}
					/>
				);
			default:
				return <div>미구현!</div>;
		}
	};

	useLayoutEffect(() => {
		if (!isLogin) {
			// TODO : aside로 개발 시 로그인 안되있음을 표시 및 로그인 페이지 바로가기 버튼 생성
			navigate(`/login?redirect=/chat`); // TEST: 로그인 페이지로 route
			return;
		}

		if (socket) {
			const data: IGetMyRoomRequestEvent = {
				page: currentPage,
				nickname,
			};
			socket.emit("get_my_rooms", data);
		}
	}, [currentPage, isLogin, navigate, nickname, socket]);

	return (
		<div className={container}>
			<ChatHeader />
			{isOpen ? (
				<CreateRoomModal
					close={setIsOpen}
					setSelectedRoom={setSelectedRoom}
				/>
			) : null}
			{renderChatRoomPage()}
		</div>
	);
};

export default ChatRooms;
