import { FC, useEffect, useLayoutEffect, useState } from "react";
import { IReadRoomResponse } from "shared";
import { roomsWrapper } from "./ChatRooms.css";
import Rooms from "./Rooms/Rooms";
import Pagenation from "./Pagenation/Pagenation";
import { useChatRoom } from "../../../state/ChatRoomStore";
import { useUserStore } from "../../../state/store";

interface Props {
	currentPage: number;
	setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
	setSelectedRoom: (room: { title: string; roomId: number }) => void;
}

const MyChatRooms: FC<Props> = ({
	currentPage,
	setCurrentPage,
	setSelectedRoom,
}) => {
	const socket = useUserStore.use.socket();

	const [isRendered, setIsRendered] = useState(false);
	const roomState = useChatRoom();

	useEffect(() => {
		if (socket) {
			socket.on("get_my_rooms", (res: IReadRoomResponse) => {
				roomState.setMyRoomInfo(
					res.totalRoomCount,
					currentPage,
					res.roomHeaders
				);
				setIsRendered(true);
			});

			return () => {
				socket.off("get_my_rooms");
			};
		}
	}, [socket, currentPage]);

	const onMyPageClick = (page: number) => {
		if (page === currentPage) {
			return;
		}
		setCurrentPage(page);
		setIsRendered(false);
	};

	useLayoutEffect(() => {
		if (!isRendered) {
			if (roomState.myRoomInfo.rooms[currentPage]) {
				setIsRendered(true);
				return;
			}
		}
	}, [currentPage]);

	return (
		<div>
			<h3>내 채팅방</h3>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "10px",
				}}
			>
				{isRendered && (
					<div className={roomsWrapper}>
						{Object.keys(roomState.myRoomInfo.rooms).length ===
						0 ? (
							<div
								style={{
									height: "100px",
								}}
							>
								{"내 채팅방 없음"}
							</div>
						) : (
							<Rooms
								isMine={true}
								rooms={roomState.myRoomInfo.rooms[currentPage]}
								setSelectedRoom={setSelectedRoom}
							/>
						)}
					</div>
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
