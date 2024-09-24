import {
	FC,
	SetStateAction,
	useEffect,
	useLayoutEffect,
	useState,
} from "react";
import { IReadRoomResponse } from "shared";
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
import { RiChatNewLine } from "react-icons/ri";

interface Props {
	currentPage: number;
	open: React.Dispatch<SetStateAction<boolean>>;
	setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
	setSelectedRoom: (room: { title: string; roomId: number }) => void;
}

const MyChatRooms: FC<Props> = ({
	currentPage,
	open,
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

	useLayoutEffect(() => {
		if (!isRendered) {
			if (roomState.myRoomInfo.rooms[currentPage]) {
				setIsRendered(true);
				return;
			}
		}
	}, [currentPage]);

	return (
		<div className={chatRoomsContainer}>
			<div className={myRoomTitleContainer}>
				<div className={myRoomTitleTextStyle}>내 채팅방</div>
				<button
					className={createButton}
					onClick={() => open(true)}
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
