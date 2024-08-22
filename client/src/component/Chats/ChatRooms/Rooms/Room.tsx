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
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { IRoomHeader } from "shared";

interface Props {
	room: IRoomHeader;
	isMine: boolean;
	index: number;
}

const Room: React.FC<Props> = ({ room, isMine, index }) => {
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const [password, setPassword] = useState("");

	const enterRoom = () => {
		// TODO: 해당 room으로 이동 -> aside에서 가능하도록 변경
		if (!room.isPrivate) {
			navigate(`/room/${room.roomId}`);
			return;
		}

		// 서버로 비밀번호 확인 요청
		// 비밀번호 일치하면 방 입장
		navigate(`/room/${room.roomId}`);
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
							{isMine ? (
								<span>
									접속 인원: {room.liveRoomInfo.curNum}
								</span>
							) : null}
							<span>참여 인원: {room.totalMembersCount}</span>
						</div>
					</div>
					{isMine ? (
						<div className={chatContainer}>
							<span>
								최근 메시지:{" "}
								{room.liveRoomInfo.lastMessage.message}
							</span>
						</div>
					) : null}
				</div>
			)}
		</div>
	);
};

export default Room;
