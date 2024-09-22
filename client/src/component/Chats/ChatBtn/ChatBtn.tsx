import { useChatAside } from "../../../state/ChatAsideStore";
import { FiMessageSquare } from "react-icons/fi";
import { FiX } from "react-icons/fi";

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
			style={{
				position: "fixed",
				bottom: "20px",
				right: "20px",
				marginTop: "20px",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				borderRadius: "30px",
				width: "50px",
				height: "50px",
				backgroundColor: "#343434",
				cursor: "pointer",
			}}
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
