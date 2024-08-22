import { FC, useEffect, useLayoutEffect, useState } from "react";
import { RoomsInfo } from "./ChatRooms";
import { IReadRoomResponse } from "shared";
import { roomsWrapper } from "./ChatRooms.css";
import Rooms from "./Rooms/Rooms";
import Pagenation from "./Pagenation/Pagenation";
import { isDevMode } from "../../../utils/detectMode";
import { testMy } from "./test-case";
import { Socket } from "socket.io-client";

interface MyChatRoomsProps {
	socket: Socket | null;
}

const MyChatRooms: FC<MyChatRoomsProps> = ({ socket }) => {
	const [isRendered, setIsRendered] = useState(false);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [myRooms, setMyRooms] = useState<RoomsInfo>({
		totalRoomCount: 0,
		rooms: {},
	});

	useEffect(() => {
		if (socket) {
			const GetRooms = async () => {
				socket.on("get_my_rooms", (res: IReadRoomResponse) => {
					setMyRooms(prevMyRooms => ({
						totalRoomCount: res.totalRoomCount,
						rooms: {
							...prevMyRooms.rooms,
							[currentPage]: res.roomHeaders,
						},
					}));
					setIsRendered(true);
				});
			};
			GetRooms();
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
			if (myRooms.rooms[currentPage]) {
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
