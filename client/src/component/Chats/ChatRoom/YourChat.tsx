import React from "react";
import { yourChat, yourChatContainer } from "./ChatRoom.css";

interface Props {
	name: string;
	content: string;
}

const YourChat: React.FC<Props> = ({ name, content }) => {
	return (
		<div className={yourChatContainer}>
			<div style={{ display: "flex", flexDirection: "column" }}>
				<div style={{ maxWidth: "100%" }}>{name}</div>
				<div className={yourChat}>{content}</div>
			</div>
		</div>
	);
};

export default YourChat;
