// import { useParams } from "react-router-dom";
import { useState } from "react";
import {
	chatInput,
	chatRoomBody,
	chatRoomContainer,
	inputContainer,
	SendButton,
} from "./ChatRoom.css";
import ChatRoomHeader from "./ChatRoomHeader";
import MyChat from "./MyChat";
import YourChat from "./YourChat";
import SystemChat from "./SystemChat";

const ChatRoom = () => {
	// const { room_id } = useParams();
	// console.log(room_id);
	const [sendMessage, setSendMessage] = useState("");

	return (
		<div className={chatRoomContainer}>
			<ChatRoomHeader title={"임시제목"} />
			<div className={chatRoomBody}>
				<SystemChat content="시스템 메세지 입니다." />
				<MyChat content={"안녕하세요 코드플레이입니다."} />
				<YourChat
					name={"상대방"}
					content={
						"코드플레이는 채팅 기능을 포함하는 커뮤니티 사이트를 만드는 팀입니다."
					}
				/>
			</div>
			<div className={inputContainer}>
				<input
					className={chatInput}
					value={sendMessage}
					onChange={e => setSendMessage(e.target.value)}
				/>
				<button className={SendButton}>Send</button>
			</div>
		</div>
	);
};

export default ChatRoom;
