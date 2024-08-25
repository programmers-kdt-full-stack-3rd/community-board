import { FC, useEffect, useLayoutEffect, useState } from "react";
import { IReadRoomResponse } from "shared";
import { roomsWrapper } from "./ChatRooms.css";
import Rooms from "./Rooms/Rooms";
import Pagenation from "./Pagenation/Pagenation";
import { isDevMode } from "../../../utils/detectMode";
import { testMy } from "./test-case";
import { useChatRoom } from "../../../state/ChatRoomStore";
import { useUserStore } from "../../../state/store";

interface MyChatRoomsProps {
	currentPage: number;
	setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const MyChatRooms: FC<MyChatRoomsProps> = ({ currentPage, setCurrentPage }) => {
	const [isRendered, setIsRendered] = useState(false);
	const roomState = useChatRoom();
	const socket = useUserStore.use.socket();

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
		if (isDevMode()) {
			roomState.setMyRoomInfo(2, 1, testMy.roomHeaders);
		} else if (!isRendered) {
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
							"내 채팅방 없음"
						) : (
							<Rooms
								isMine={true}
								rooms={roomState.myRoomInfo.rooms[currentPage]}
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
