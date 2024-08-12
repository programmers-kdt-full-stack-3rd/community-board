import React from "react";
import { myChat, myChatContainer } from "./ChatRoom.css";

interface Props {
	content: string;
}

const MyChat: React.FC<Props> = ({ content }) => {
	return (
		<div className={myChatContainer}>
			<div className={myChat}>{content}</div>
		</div>
	);
};

export default MyChat;
