import { container } from "./Rooms.css";
import Room from "./Room";
import { IRoomHeader } from "shared";

interface Props {
	isMine: boolean;
	rooms: IRoomHeader[];
	setSelectedRoom: (room: { title: string; roomId: number }) => void;
}

const Rooms: React.FC<Props> = ({ isMine, rooms, setSelectedRoom }) => {
	return (
		<div className={container}>
			{rooms.map((room, index) => (
				<Room
					room={room}
					isMine={isMine}
					index={index}
					setSelectedRoom={setSelectedRoom}
				/>
			))}
		</div>
	);
};

export default Rooms;
