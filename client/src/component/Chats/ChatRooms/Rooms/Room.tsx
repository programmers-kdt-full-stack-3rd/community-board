import {
	chatContainer,
	lockIcon,
	numContainer,
	passwordInput,
	roomContainer,
	roomHeaderContainer,
	roomWrapper,
	titleContainer,
} from "./Rooms.css";
import { CiLock } from "react-icons/ci";
import { useState } from "react";
import { IJoinRoomRequest, IRoomHeader } from "shared";
import { useUserStore } from "../../../../state/store";
import { FaUsers } from "react-icons/fa";

interface Props {
	room: IRoomHeader;
	isMine: boolean;
	index: number;
	setSelectedRoom: (room: { title: string; roomId: number }) => void;
}

const Room: React.FC<Props> = ({ room, isMine, index, setSelectedRoom }) => {
	// 전역 상태
	const nickname = useUserStore.use.nickname();
	const socket = useUserStore.use.socket();

	// 상태
	const [open, setOpen] = useState(false);
	const [password, setPassword] = useState("");

	const enterRoom = () => {
		if (open && socket) {
			const data: IJoinRoomRequest = {
				roomId: room.roomId,
				nickname,
				isPrivate: room.isPrivate,
				password: "",
			};

			socket.emit("join_room", data, (isSuccess: boolean) => {
				if (isSuccess) {
					setSelectedRoom({ roomId: room.roomId, title: room.title });
				} else {
					console.error("가입 실패");
				}
			});
		}

		// TODO: 해당 room으로 이동 -> aside에서 가능하도록 변경
		if (!room.isPrivate) {
			setSelectedRoom({ roomId: room.roomId, title: room.title });
			return;
		}

		// 서버로 비밀번호 확인 요청
		// 비밀번호 일치하면 방 입장
		// navigate(`/room/${room.roomId}`);
	};

	const onRoomClick = () => {
		if (isMine) {
			enterRoom();
			return;
		}

		setOpen(true);
	};

	return (
		<div
			className={roomWrapper}
			key={index}
		>
			{open ? (
				<div className={roomContainer}>
					<div className={roomHeaderContainer}>
						<div className={titleContainer}>
							{room.isPrivate ? (
								<CiLock className={lockIcon} />
							) : (
								" "
							)}
							채팅방 이름: {room.title}
						</div>
						{room.isPrivate ? (
							<input
								className={passwordInput}
								value={password}
								onChange={e => setPassword(e.target.value)}
							/>
						) : null}
						<button onClick={enterRoom}>입장하기</button>
					</div>
				</div>
			) : (
				<div
					className={roomContainer}
					onClick={onRoomClick}
				>
					<div className={roomHeaderContainer}>
						<div className={titleContainer}>
							{room.isPrivate ? (
								<CiLock className={lockIcon} />
							) : (
								" "
							)}
							채팅방 이름: {room.title}
						</div>
						<div className={numContainer}>
							{/* TODO : 접속 인원 소켓에서 추가 */}
							{/* {isMine ? <span>접속 인원: </span> : null} */}
							<span>
								<FaUsers /> {room.totalMembersCount}
							</span>
						</div>
					</div>
					{isMine ? (
						<div className={chatContainer}>
							{/* TODO : 최근 메시지 소켓에서 추가 */}
							{/* <span>최근 메시지: </span> */}
						</div>
					) : null}
				</div>
			)}
		</div>
	);
};

export default Room;
