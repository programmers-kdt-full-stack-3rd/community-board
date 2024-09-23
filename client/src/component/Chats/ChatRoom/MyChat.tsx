import React from "react";
import { myChat, myChatContainer } from "./ChatRoom.css";

interface Props {
	content: string;
	time: Date;
}

const MyChat: React.FC<Props> = ({ content, time }) => {
	return (
		<div className={myChatContainer}>
			<div
				style={{
					display: "flex",
					justifyContent: "end",
					alignItems: "end",
					marginRight: "5px",
				}}
			>
				{time.toISOString().slice(11, 16)}
			</div>
			<div className={myChat}>{content}</div>
		</div>
	);
};

export default MyChat;
