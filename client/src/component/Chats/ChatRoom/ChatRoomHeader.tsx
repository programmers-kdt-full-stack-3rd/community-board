import React from "react";
import { chatRoomHeader } from "./ChatRoom.css";
import { FaArrowLeft } from "react-icons/fa";
import { IoListOutline } from "react-icons/io5";

interface Props {
	title: string;
}

const ChatRoomHeader: React.FC<Props> = ({ title }) => {
	return (
		<div className={chatRoomHeader}>
			<div className="go_back">
				<FaArrowLeft />
			</div>
			<div className="title">{title}</div>
			<div className="dropdown">
				<IoListOutline />
			</div>
		</div>
	);
};

export default ChatRoomHeader;
