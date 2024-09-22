import ChatPage from "../../../page/Chat/ChatPage";

const ChatAside = () => {
	return (
		<div
			style={{
				position: "fixed",
				right: "20px",
				bottom: "90px",
				backgroundColor: "#444444",
				width: "400px",
				height: "calc(100% - 100px)",
				maxHeight: "500px",
				minHeight: "200px",
				zIndex: "2",
				borderRadius: "20px",
				color: "black",
				paddingTop: "20px",
				paddingBottom: "10px",
				paddingLeft: "15px",
				paddingRight: "15px",
				overflowY: "hidden",
			}}
		>
			<ChatPage />
		</div>
	);
};

export default ChatAside;
