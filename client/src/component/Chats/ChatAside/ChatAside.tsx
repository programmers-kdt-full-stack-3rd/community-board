import ChatPage from "../../../page/Chat/ChatPage";

const ChatAside = () => {
	return (
		<div
			style={{
				width: "30%",
				minWidth: "400px",
				minHeight: "500px",
				zIndex: "2",
				border: "1px solid white",
				color: "black",
				padding: "10px",
				height: "100%",
			}}
		>
			<ChatPage />
		</div>
	);
};

export default ChatAside;
