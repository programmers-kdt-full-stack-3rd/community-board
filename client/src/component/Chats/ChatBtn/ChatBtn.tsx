import { useChatAside } from "../../../state/ChatAsideStore";
import { FiMessageSquare } from "react-icons/fi";
import { FiX } from "react-icons/fi";
import { chatBtnStyle } from "./ChatBtn.css";

const ChatBtn = () => {
	const { isOpen, open, close } = useChatAside();

	const handleChatAside = () => {
		if (isOpen) {
			close();
		} else {
			open();
		}
	};

	return (
		<div
			className={chatBtnStyle}
			onClick={() => handleChatAside()}
		>
			{isOpen ? (
				<FiX
					size="30"
					color="#ffffff"
				/>
			) : (
				<FiMessageSquare
					size="30"
					title="채팅"
					color="#ffffff"
				/>
			)}
		</div>
	);
};

export default ChatBtn;
