// import { useParams } from "react-router-dom";
import { useState } from "react";
import {
	chatInput,
	chatRoomBody,
	chatRoomContainer,
	inputContainer,
	myChat,
	myChatContainer,
	SendButton,
	yourChat,
	yourChatContainer,
} from "./ChatRoom.css";
import ChatRoomHeader from "./ChatRoomHeader";

const ChatRoom = () => {
	// const { room_id } = useParams();
	// console.log(room_id);
	const [sendMessage, setSendMessage] = useState("");

	return (
		<div className={chatRoomContainer}>
			<ChatRoomHeader title={"임시제목"} />
			<div className={chatRoomBody}>
				<div className={myChatContainer}>
					<div className={myChat}>안녕하세요 코드플레이입니다.</div>
				</div>
				<div className={yourChatContainer}>
					<div style={{ display: "flex", flexDirection: "column" }}>
						<div>상대방이름</div>
						<div className={yourChat}>
							코드플레이는 채팅 기능을 포함하는 커뮤니티 사이트를
							만드는 팀입니다.
						</div>
					</div>
				</div>
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
