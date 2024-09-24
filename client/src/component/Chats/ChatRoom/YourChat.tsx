import React from "react";
import { yourChat, yourChatContainer } from "./ChatRoom.css";

interface Props {
	name: string;
	content: string;
	time: Date;
}

const YourChat: React.FC<Props> = ({ name, content, time }) => {
	return (
		<div className={yourChatContainer}>
			<div style={{ display: "flex", flexDirection: "column" }}>
				<div style={{ maxWidth: "100%" }}>{name}</div>
				<div
					style={{
						display: "flex",
						flexDirection: "row",
					}}
				>
					<div className={yourChat}>{content}</div>
					<div
						style={{
							display: "flex",
							justifyContent: "end",
							alignItems: "end",
							marginLeft: "5px",
						}}
					>
						{time.toISOString().slice(11, 16)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default YourChat;
