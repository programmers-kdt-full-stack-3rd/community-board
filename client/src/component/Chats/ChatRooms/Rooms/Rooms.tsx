import { container } from "./Rooms.css";
import Room from "./Room";
import { IRoomHeader } from "shared";

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
