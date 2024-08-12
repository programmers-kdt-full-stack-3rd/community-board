// import { useParams } from "react-router-dom";
import { useState } from "react";
import { chatRoomBody, chatRoomContainer } from "./ChatRoom.css";
import ChatRoomHeader from "./ChatRoomHeader";
import MyChat from "./MyChat";
import YourChat from "./YourChat";
import SystemChat from "./SystemChat";
import ChatInput from "./ChatInput";

// TODO : aside로 옮길 때는 Props로 roomHeader 받아서 사용하기

const ChatRoom = () => {
	// const { room_id } = useParams();
	// console.log(room_id);
	const [message, setMessage] = useState("");
	const sendMessage = () => {
		if (!message.length) {
			return;
		}
		// TODO : 메세지를 local state에 추가하는 로직
		// TODO : socket으로 메세지 보내는 로직
		// TODO : 스피너 돌리는 로직
		setMessage("");
	};

	// TODO : 메세지 interface 추가 이후, 메세지 리스트를 이용하여 메세지 컴포넌트를 자동 생성하는 로직 추가

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
			<ChatInput
				message={message}
				setMessage={setMessage}
				onClick={sendMessage}
			/>
		</div>
	);
};

export default ChatRoom;
