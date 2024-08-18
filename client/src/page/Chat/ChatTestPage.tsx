import { useNavigate } from "react-router-dom";

interface Props {
	// 로그인 시 연결하는 전반적인 웹소켓 관련 Props
	socket?: WebSocket;
}

const ChatTestPage: React.FC<Props> = ({ socket }) => {
	const navigate = useNavigate();

	if (socket) {
		// 오류 안나게 임시로 넣은 코드.
		// TODO : 제거 하기
		console.log("connect");
	}

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
			<button onClick={() => navigate("/rooms")}>채팅방 페이지</button>
			<button onClick={() => navigate("/room/1")}>채팅 페이지</button>
		</div>
	);
};

export default ChatTestPage;
