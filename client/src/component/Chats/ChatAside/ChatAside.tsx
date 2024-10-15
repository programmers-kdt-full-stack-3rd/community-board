import { useLayoutEffect, useRef } from "react";
import ChatPage from "../../../page/Chat/ChatPage";
import { useChatAside } from "../../../state/ChatAsideStore";
import { chatAsideStyle } from "./ChatAside.css";

const ChatAside = () => {
	const { setChatModalContainer } = useChatAside();
	const chatModalRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		setChatModalContainer(chatModalRef.current);
	}, [chatModalRef.current]);

	return (
		<div className={chatAsideStyle}>
			<div ref={chatModalRef} />
			<ChatPage />
		</div>
	);
};

export default ChatAside;
