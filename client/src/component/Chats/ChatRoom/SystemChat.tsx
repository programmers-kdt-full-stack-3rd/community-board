import React from "react";
import { systemChat, systemChatContainer } from "./ChatRoom.css";

interface Props {
	content: string;
}

const SystemChat: React.FC<Props> = ({ content }) => {
	return (
		<div className={systemChatContainer}>
			<div className={systemChat}>{content}</div>
		</div>
	);
};

export default SystemChat;
