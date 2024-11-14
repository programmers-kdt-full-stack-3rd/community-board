import { FC, useEffect, useState } from "react";
import { RiChatNewLine } from "react-icons/ri";
import { IReadRoomRequest, IReadRoomResponse } from "shared";

import {
	chatRoomsContainer,
	createButton,
	myRoomTitleContainer,
	myRoomTitleTextStyle,
	roomsWrapper,
} from "./ChatRooms.css";
import Rooms from "./Rooms/Rooms";
import Pagenation from "./Pagenation/Pagenation";

import { useChatRoom } from "../../../state/ChatRoomStore";
import { useUserStore } from "../../../state/store";

interface Props {
	currentPage: number;
	open: () => void;
	setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
	setSelectedRoom: (room: { title: string; roomId: number }) => void;
}

interface ISocketReadRoomResponse {
	success: boolean;
	data?: IReadRoomResponse;
	message?: string;
}

const MyChatRooms: FC<Props> = ({
	currentPage,
	open,
	setCurrentPage,
	setSelectedRoom,
}) => {
	const socket = useUserStore.use.socket();
	const roomState = useChatRoom();

	const [isRendered, setIsRendered] = useState(false);

	useEffect(() => {
		if (socket) {
			const data: IReadRoomRequest = {
				page: currentPage,
				perPage: 2,
				isSearch: false,
				keyword: "",
			};

			const handleResponse = (res: ISocketReadRoomResponse) => {
				if (res.success) {
					roomState.setMyRoomInfo(
						res.data!.totalRoomCount,
						currentPage,
						res.data!.roomHeaders
					);
					setIsRendered(true);
				} else {
					// TODO: 불러오기 실패 처리 로직
					console.error(res.message);
				}
			};

			socket.emit("get_my_rooms", data, handleResponse);
		}
	}, [socket, currentPage]);

	const onMyPageClick = (page: number) => {
		if (page === currentPage) {
			return;
		}
		setCurrentPage(page);
		setIsRendered(false);
	};

	const renderMyChatRooms = () => {
		if (Object.keys(roomState.myRoomInfo.rooms).length === 0) {
			return (
				<div
					style={{
						height: "100px",
					}}
				>
					{"내 채팅방 없음"}
				</div>
			);
		} else {
			return (
				<Rooms
					isMine={true}
					rooms={roomState.myRoomInfo.rooms[currentPage]}
					setSelectedRoom={setSelectedRoom}
				/>
			);
		}
	};

	return (
		<div className={chatRoomsContainer}>
			<div className={myRoomTitleContainer}>
				<div className={myRoomTitleTextStyle}>내 채팅방</div>
				<button
					className={createButton}
					onClick={open}
				>
					<RiChatNewLine title="채팅방 생성" />
				</button>
			</div>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "10px",
					height: "100%",
				}}
			>
				{isRendered && (
					<div className={roomsWrapper}>{renderMyChatRooms()}</div>
				)}
				{roomState.myRoomInfo.totalRoomCount > 2 ? (
					<Pagenation
						total={roomState.myRoomInfo.totalRoomCount}
						curPage={currentPage}
						setCurPage={setCurrentPage}
						onPageClick={onMyPageClick}
					/>
				) : null}
			</div>
		</div>
	);
};

export default MyChatRooms;
