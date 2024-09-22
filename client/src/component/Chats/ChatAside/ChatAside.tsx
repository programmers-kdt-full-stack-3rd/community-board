import ChatPage from "../../../page/Chat/ChatPage";
import { chatAsideStyle } from "./ChatAside.css";

const ChatAside = () => {
	return (
		<div className={chatAsideStyle}>
			<ChatPage />
		</div>
	);
};

export default ChatAside;
