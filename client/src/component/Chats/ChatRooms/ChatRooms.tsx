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
import { useModal } from "../../../hook/useModal";
import Button from "../../common/Button";

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

	const createRoomModal = useModal();
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
						open={createRoomModal.open}
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

	const handleCreateRoomAccept = (room: {
		title: string;
		roomId: number;
	}) => {
		setSelectedRoom(room);
		createRoomModal.close();
	};

	return (
		<div className={container}>
			{isLogin ? (
				<div className={chatRoomsStyle}>
					{createRoomModal.isOpen ? (
						<CreateRoomModal
							onAccept={handleCreateRoomAccept}
							onClose={createRoomModal.close}
						/>
					) : null}
					{renderChatRoomPage()}
					<ChatFooter />
				</div>
			) : (
				<div className={loginGuidanceStyle}>
					<p>로그인 후 이용할 수 있습니다.</p>
					<Button
						color="action"
						size="large"
						onClick={() => {
							navigate("/login");
							close();
						}}
					>
						로그인
					</Button>
				</div>
			)}
		</div>
	);
};

export default ChatRooms;
