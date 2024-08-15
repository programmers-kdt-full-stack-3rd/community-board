import { container } from "./Rooms.css";
import Room from "./Room";

export interface IRoomHeader {
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

const Rooms: React.FC<IRoomsProps> = ({ isMine, rooms }) => {
	return (
		<div className={container}>
			{rooms.map((room, index) => (
				<Room
					room={room}
					isMine={isMine}
					index={index}
				/>
			))}
		</div>
	);
};

export default Rooms;
