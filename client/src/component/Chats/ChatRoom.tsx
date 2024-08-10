import { useParams } from "react-router-dom";

const ChatRoom = () => {
	const { room_id } = useParams();
	console.log(room_id);
	return <div>ChatRoom</div>;
};

export default ChatRoom;
