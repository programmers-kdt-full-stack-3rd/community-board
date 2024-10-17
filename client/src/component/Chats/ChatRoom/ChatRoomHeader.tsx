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
	isOpen: boolean;
	open: () => void;
	close: () => void;
}

const ChatRoomHeader: React.FC<Props> = ({
	title,
	onClick,
	isOpen,
	open,
	close,
}) => {
	return (
		<div className={chatRoomHeader}>
			<div
				className={goBack}
				onClick={onClick}
			>
				<FaArrowLeft className={chatRoomHeaderIcon} />
			</div>
			<div className={chatRoomHeaderTitle}>{title}</div>
			<div
				className={dropdown}
				onClick={() => {
					if (isOpen) {
						close();
					} else {
						open();
					}
				}}
			>
				<IoListOutline className={chatRoomHeaderIcon} />
			</div>
		</div>
	);
};

export default ChatRoomHeader;
