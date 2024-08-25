import React from "react";
import { chatRoomHeader, goBack } from "./ChatRoom.css";
import { FaArrowLeft } from "react-icons/fa";
import { IoListOutline } from "react-icons/io5";

interface Props {
	title: string;
	onClick: () => void;
}

const ChatRoomHeader: React.FC<Props> = ({ title, onClick }) => {
	return (
		<div className={chatRoomHeader}>
			<div
				className={goBack}
				onClick={onClick}
			>
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
