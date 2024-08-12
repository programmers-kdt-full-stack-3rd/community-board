import { FC, MouseEvent } from "react";
import { CiLock } from "react-icons/ci";

import {
	container,
	chatContainer,
	numContainer,
	roomHeaderContainer,
	roomContainer,
	roomWrapper,
	lockIcon,
	titleContainer,
} from "./Rooms.css";
import { useNavigate } from "react-router-dom";

interface IRoomHeader {
	roomId: string;
	title: string;
	is_private: boolean;
	participantNum: number; // 채팅방에 속한 사람들
	curNum: number | null; // 현재 접속 중인 사람들
	lastMessage: string | null;
}

interface IRoomsProps {
	isMine: boolean;
	rooms: IRoomHeader[];
}

const Rooms: FC<IRoomsProps> = ({ isMine, rooms }) => {
	const navigate = useNavigate();

	const onRoomClick =
		(roomId: string) => (event: MouseEvent<HTMLDivElement>) => {
			// TODO: 해당 room으로 이동
			console.log(roomId);

			// TODO: 비밀방 입장시 비밀번호 입력 모달 생성

			// 테스트용 : /room/1
			navigate("/room/1");
		};

	return (
		<div className={container}>
			{rooms.map((room, index) => (
				<div
					className={roomWrapper}
					key={index}
				>
					<div
						className={roomContainer}
						onClick={onRoomClick(room.roomId)}
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
								{isMine ? (
									<span>접속 인원: {room.curNum}</span>
								) : null}
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
			))}
		</div>
	);
};

export default Rooms;
