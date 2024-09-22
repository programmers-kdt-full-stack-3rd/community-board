import { FC, useLayoutEffect, useState } from "react";
import {
	chatRoomsContainer,
	chatRoomsStyle,
	container,
	loginGuidanceStyle,
} from "./ChatRooms.css";
import { IGetMyRoomRequestEvent, IRoomHeader } from "shared";
import CreateRoomModal from "./Modal/CreateRoomModal";
import MyChatRooms from "./MyChatRooms";
import SearchedChatRooms from "./SearchedChatRooms";
import { useUserStore } from "../../../state/store";
import { useNavigate } from "react-router-dom";
import ChatFooter from "./ChatFooter";
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
	const { category, close } = useChatAside();

	const renderChatRoomPage = () => {
		switch (category) {
			case ChatAsideCategory.SEARCH:
				return <SearchedChatRooms setSelectedRoom={setSelectedRoom} />;
			case ChatAsideCategory.MYROOM:
				return (
					<MyChatRooms
						currentPage={currentPage}
						open={setIsOpen}
						setCurrentPage={setCurrentPage}
						setSelectedRoom={setSelectedRoom}
					/>
				);
			default:
				return <div className={chatRoomsContainer}>미구현!</div>;
		}
	};

	useLayoutEffect(() => {
		if (socket && category === ChatAsideCategory.MYROOM) {
			const data: IGetMyRoomRequestEvent = {
				page: currentPage,
				nickname,
			};
			socket.emit("get_my_rooms", data);
		}
	}, [currentPage, isLogin, navigate, nickname, socket, category]);

	return (
		<div className={container}>
			{isLogin ? (
				<div className={chatRoomsStyle}>
					{isOpen ? (
						<CreateRoomModal
							close={setIsOpen}
							setSelectedRoom={setSelectedRoom}
						/>
					) : null}
					{renderChatRoomPage()}
					<ChatFooter />
				</div>
			) : (
				<div className={loginGuidanceStyle}>
					<p>로그인 후 이용할 수 있습니다.</p>
					<button
						onClick={() => {
							navigate("/login");
							close();
						}}
					>
						로그인
					</button>
				</div>
			)}
		</div>
	);
};

export default ChatRooms;
