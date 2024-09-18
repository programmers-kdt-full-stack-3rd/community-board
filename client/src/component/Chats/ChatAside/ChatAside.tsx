import ChatPage from "../../../page/Chat/ChatTestPage";

const ChatAside = () => {
	return (
		<div
			style={{
				width: "30%",
				zIndex: "2",
				border: "1px solid white",
				color: "black",
				padding: "10px",
			}}
		>
			<ChatPage />
		</div>
	);
};

export default ChatAside;
