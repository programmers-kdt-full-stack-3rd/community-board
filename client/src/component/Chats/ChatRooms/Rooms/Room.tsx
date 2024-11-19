import { useEffect, useState } from "react";
import { CiLock } from "react-icons/ci";
import { FaUsers } from "react-icons/fa";
import { IJoinRoomRequest, IJoinRoomResponse, IRoomHeader } from "shared";

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
import { useUserStore } from "../../../../state/store";

interface Props {
	room: IRoomHeader;
	isMine: boolean;
	index: number;
	setSelectedRoom: (room: { title: string; roomId: number }) => void;
}

interface ISocketJoinRoomResponse {
	success: boolean;
	data?: IJoinRoomResponse;
	message?: string;
}

const Room: React.FC<Props> = ({ room, isMine, index, setSelectedRoom }) => {
	// 전역 상태
	const socket = useUserStore.use.socket();
	const nickname = useUserStore.use.nickname();

	// 상태
	const [open, setOpen] = useState(false);
	const [isEnter, setIsEnter] = useState(false);
	const [password, setPassword] = useState("");

	// 채팅방 가입 됐을 때만 채팅방으로 이동
	useEffect(() => {
		if (isEnter)
			setSelectedRoom({ roomId: room.roomId, title: room.title });
	}, [isEnter]);

	// 가입하지 않은 채팅방 입장 컴포넌트로 변환
	const onRoomClick = () => {
		if (isMine) setIsEnter(true);
		else setOpen(!open);
	};

	// 가입하지 않은 채팅방 입장 버튼 클릭
	const onEnterClick = () => {
		// 소켓 재연결 설정
		if (!socket) {
			console.log("소켓 연결 x");
			return;
		}

		if (open) {
			// (비밀방 기능 추가시) 모달로부터 password 불러오기
			const data: IJoinRoomRequest = {
				roomId: room.roomId,
				nickname,
				isPrivate: room.isPrivate,
				password: "",
			};

			// 채팅방 가입 수신 이벤트
			socket.emit("join_room", data, (res: ISocketJoinRoomResponse) => {
				if (res.success) setIsEnter(true);
				else console.error(res.message);
			});
		}
	};

	return (
		<div
			className={roomWrapper}
			key={index}
			onClick={onRoomClick}
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
							{room.title}
						</div>
						{room.isPrivate ? (
							<input
								className={passwordInput}
								value={password}
								onChange={e => setPassword(e.target.value)}
							/>
						) : null}
						<button onClick={onEnterClick}>입장</button>
					</div>
				</div>
			) : (
				<div className={roomContainer}>
					<div className={roomHeaderContainer}>
						<div className={titleContainer}>
							{room.isPrivate ? (
								<CiLock className={lockIcon} />
							) : (
								" "
							)}
							{room.title}
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
