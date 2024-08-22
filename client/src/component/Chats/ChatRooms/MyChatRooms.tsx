import { useLayoutEffect, useState } from "react";
import { IReadRoomRequest, IReadRoomResponse } from "shared";
import { ClientError } from "../../../api/errors";
import { ApiCall } from "../../../api/api";
import { sendGetRoomHeadersRequest } from "../../../api/chats/crud";
import { useErrorModal } from "../../../state/errorModalStore";
import { roomsWrapper } from "./ChatRooms.css";
import Rooms from "./Rooms/Rooms";
import Pagenation from "./Pagenation/Pagenation";
import { isDevMode } from "../../../utils/detectMode";
import { testMy } from "./test-case";
import { useChatRoom } from "../../../state/ChatRoomStore";

const MyChatRooms = () => {
	const [isRendered, setIsRendered] = useState(false);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const errorModal = useErrorModal();
	const roomState = useChatRoom();

	const GetRooms = async (body: IReadRoomRequest) => {
		const queryString = `?page=${body.page}&perPage=${body.perPage}&isSearch=${body.isSearch}&keyword=${body.keyword}`;

		const res: IReadRoomResponse | ClientError = await ApiCall(
			() => sendGetRoomHeadersRequest(queryString),
			err => {
				errorModal.setErrorMessage(err.message);
				errorModal.open();
			}
		);

		if (res instanceof ClientError) {
			return;
		}

		roomState.setMyRoomInfo(res.totalRoomCount, body.page, res.roomHeaders);

		setIsRendered(true);
	};

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
			const body: IReadRoomRequest = {
				page: currentPage,
				perPage: 2,
				isSearch: false,
				keyword: "",
			};
			GetRooms(body);
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
