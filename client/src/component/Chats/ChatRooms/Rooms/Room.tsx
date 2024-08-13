import {
	chatContainer,
	lockIcon,
	numContainer,
	roomContainer,
	roomHeaderContainer,
	roomWrapper,
	titleContainer,
} from "./Rooms.css";
import { IRoomHeader } from "./Rooms";
import { CiLock } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

interface Props {
	room: IRoomHeader;
	isMine: boolean;
	index: number;
}

const Room: React.FC<Props> = ({ room, isMine, index }) => {
	const navigate = useNavigate();

	const onRoomClick = () => {
		// TODO: 비밀방 입장시 비밀번호 입력 모달 생성

		// TODO: 해당 room으로 이동 -> aside에서 가능하도록 변경
		navigate(`/room/${room.roomId}`);
	};

	return (
		<div
			className={roomWrapper}
			key={index}
		>
			<div
				className={roomContainer}
				onClick={onRoomClick}
			>
				<div className={roomHeaderContainer}>
					<div className={titleContainer}>
						{room.is_private ? (
							<CiLock className={lockIcon} />
						) : (
							" "
						)}
						채팅방 이름: {room.title}
					</div>
					<div className={numContainer}>
						{isMine ? <span>접속 인원: {room.curNum}</span> : null}
						<span>참여 인원: {room.participantNum}</span>
					</div>
				</div>
				{isMine ? (
					<div className={chatContainer}>
						<span>최근 메시지: {room.lastMessage}</span>
					</div>
				) : null}
			</div>
		</div>
	);
};

export default Room;
