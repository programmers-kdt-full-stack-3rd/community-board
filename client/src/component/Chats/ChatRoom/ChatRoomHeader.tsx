import React from "react";
import {
	chatRoomHeader,
	chatRoomHeaderIcon,
	chatRoomHeaderTitle,
	dropdown,
	goBack,
} from "./ChatRoom.css";
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
				<FaArrowLeft className={chatRoomHeaderIcon} />
			</div>
			<div className={chatRoomHeaderTitle}>{title}</div>
			<div className={dropdown}>
				<IoListOutline className={chatRoomHeaderIcon} />
			</div>
		</div>
	);
};

export default ChatRoomHeader;
