// import { useParams } from "react-router-dom";
import { useState } from "react";
import { chatRoomBody, chatRoomContainer } from "./ChatRoom.css";
import ChatRoomHeader from "./ChatRoomHeader";
import MyChat from "./MyChat";
import YourChat from "./YourChat";
import SystemChat from "./SystemChat";
import ChatInput from "./ChatInput";

// TODO : shared에 IMessage 옮기기
interface IMessage {
	roomId: string;
	nickname: string;
	message: string;
	created_at: Date;
	is_mine: boolean;
	is_system: boolean;
}

// TODO : zustand state 사용하는 것으로 바꾸기
const testMessages: IMessage[] = [
	{
		roomId: "123",
		nickname: "system",
		message: "방이 생성되었습니다.",
		created_at: new Date(),
		is_mine: false,
		is_system: true,
	},
	{
		roomId: "123",
		nickname: "testUser1",
		message: "안녕하세요 코드플레이입니다.",
		created_at: new Date(),
		is_mine: true,
		is_system: false,
	},
	{
		roomId: "123",
		nickname: "testUser2",
		message:
			"코드플레이는 채팅 기능을 포함하는 커뮤니티 사이트를 만드는 팀입니다.",
		created_at: new Date(),
		is_mine: false,
		is_system: false,
	},
];

// TODO : IRoomHeader Props로 받기
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

	const renderMessages = () => {
		return testMessages.map(message => {
			if (message.is_system) {
				return <SystemChat content={message.message} />;
			}

			if (message.is_mine) {
				return <MyChat content={message.message} />;
			}

			return (
				<YourChat
					name={message.nickname}
					content={message.message}
				/>
			);
		});
	};

	return (
		<div className={chatRoomContainer}>
			<ChatRoomHeader title={"임시제목"} />
			<div className={chatRoomBody}>{renderMessages()}</div>
			<ChatInput
				message={message}
				setMessage={setMessage}
				onClick={sendMessage}
			/>
		</div>
	);
};

export default ChatRoom;
