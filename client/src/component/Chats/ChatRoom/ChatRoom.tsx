import { useLayoutEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IMessage } from "shared";

import { chatRoomBody, chatRoomContainer } from "./ChatRoom.css";
import ChatInput from "./ChatInput";
import ChatRoomHeader from "./ChatRoomHeader";
import MyChat from "./MyChat";
import SystemChat from "./SystemChat";
import YourChat from "./YourChat";
import { useUserStore } from "../../../state/store";

// TODO : props로 roomId, title 받을 것
const ChatRoom = () => {
	const navigate = useNavigate(); // TEST : 채팅방 페이지

	// 전역 상태
	const isLogin = useUserStore.use.isLogin();
	const nickname = useUserStore.use.nickname();
	const socket = useUserStore.use.socket();
	// TODO : zustand에서 해당 채팅방에 대한 메시지 꺼내오기

	// 컴포넌트 상태
	const [message, setMessage] = useState("");
	// TODO : messageLogs zustand에 저장할 것
	const [messageLogs, setMessageLogs] = useState<IMessage[]>([]); // TEST : 컴포넌트 상태 저장
	const [roomLoading, setRoomLoading] = useState(true);
	const [chatLoading, setChatLoading] = useState(false);

	// TODO : roomId zustand에서 꺼내올 것
	const { room_id } = useParams(); // TEST: 채팅방 임시 데이터
	const roomId = parseInt(room_id!);

	useLayoutEffect(() => {
		if (!isLogin) {
			// TODO : aside로 개발 시 로그인 안되있음을 표시 및 로그인 페이지 바로가기 버튼 생성
			navigate(`/login?redirect=/room/${roomId}`); // TEST: 로그인 페이지로 route
			return;
		}

		if (socket) {
			// 이전 메시지 모두 불러오기
			socket.emit("enter_room", roomId, (response: IMessage[]) => {
				setMessageLogs(response);
				setRoomLoading(false);
			});

			// 실시간 메시지 수신 설정
			socket.on("receive_message", (newMessage: IMessage) => {
				setMessageLogs(prevLogs => [...prevLogs, newMessage]);
			});

			return () => {
				// 소켓 이벤트 핸들러 제거
				if (socket) {
					socket.off("enter_room");
					socket.off("send_message");
				}
			};
		}
	}, [isLogin, roomId, socket, navigate]);

	const chatInputClick = () => {
		if (!message.length) {
			return;
		}

		const msg: IMessage = {
			roomId,
			nickname,
			message,
			createdAt: new Date(),
			isMine: true,
			isSystem: false,
		};

		setChatLoading(true);

		if (socket) {
			socket.emit("send_message", msg, (isSuccess: boolean) => {
				if (isSuccess) {
					setMessageLogs(prev => [...prev, msg]);
					// TODO : zustand에 저장
				} else {
					console.error(msg);
					// TODO : 재전송 로직 추가
				}

				setChatLoading(false);
			});
		}

		setMessage("");
	};

	const renderMessages = () => {
		if (roomLoading) {
			// TODO : spinner 추가
			return <p>Loading...</p>;
		}

		return messageLogs.map((message, index) => {
			if (message.isSystem) {
				return (
					<SystemChat
						key={index}
						content={message.message}
					/>
				);
			} else if (message.isMine) {
				return (
					<MyChat
						key={index}
						content={message.message}
					/>
				);
			}

			return chatLoading ? (
				// TODO : spinner 추가
				<p>Loading...</p>
			) : (
				<YourChat
					key={index}
					name={message.nickname}
					content={message.message}
				/>
			);
		});
	};

	return (
		<div className={chatRoomContainer}>
			{/* TODO : title zustand에서 꺼내오기 */}
			<ChatRoomHeader title={"임시 채팅방 제목"} />
			<div className={chatRoomBody}>{renderMessages()}</div>
			<ChatInput
				message={message}
				setMessage={setMessage}
				onClick={chatInputClick}
			/>
		</div>
	);
};

export default ChatRoom;
