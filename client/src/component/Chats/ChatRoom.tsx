// import { useParams } from "react-router-dom";
import { useState } from "react";
import {
	chatInput,
	chatRoomBody,
	chatRoomContainer,
	chatRoomHeader,
	inputContainer,
	myChat,
	myChatContainer,
	SendButton,
	yourChat,
	yourChatContainer,
} from "./ChatRoom.css";

const ChatRoom = () => {
	// const { room_id } = useParams();
	// console.log(room_id);
	const [sendMessage, setSendMessage] = useState("");

	return (
		<div className={chatRoomContainer}>
			<div className={chatRoomHeader}>
				<div className="go_back">뒤로가기</div>
				<div className="title">제목제목</div>
				<div className="dropdown">드랍다운</div>
			</div>
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
