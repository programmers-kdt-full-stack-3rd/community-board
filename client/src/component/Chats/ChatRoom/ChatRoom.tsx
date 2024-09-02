import { FC, useLayoutEffect, useState } from "react";
import { IMessage } from "shared";

import { chatRoomBody, chatRoomContainer } from "./ChatRoom.css";
import ChatInput from "./ChatInput";
import ChatRoomHeader from "./ChatRoomHeader";
import MyChat from "./MyChat";
import SystemChat from "./SystemChat";
import YourChat from "./YourChat";
import { useUserStore } from "../../../state/store";

interface Props {
	title: string;
	roomId: number;
	setSelectedRoom: (room: { title: string; roomId: number } | null) => void;
}

// TODO : props로 roomId, title 받을 것
const ChatRoom: FC<Props> = ({ title, roomId, setSelectedRoom }) => {
	// 전역 상태
	const nickname = useUserStore.use.nickname();
	const socket = useUserStore.use.socket();
	// TODO : zustand에서 해당 채팅방에 대한 메시지 꺼내오기

	// 컴포넌트 상태
	const [message, setMessage] = useState("");
	// TODO : messageLogs zustand에 저장할 것
	const [messageLogs, setMessageLogs] = useState<IMessage[]>([]); // TEST : 컴포넌트 상태 저장
	const [roomLoading, setRoomLoading] = useState(true);
	const [chatLoading, setChatLoading] = useState(false);
	const [memberId, setMemberId] = useState<number>(0);

	useLayoutEffect(() => {
		if (socket) {
			const handleReceiveMessage = (newMessage: IMessage) => {
				setMessageLogs(prev => [...prev, newMessage]);
			};

			// 이전 메시지 모두 불러오기
			socket.emit(
				"enter_room",
				roomId,
				(response: { memberId: number; messageLogs: IMessage[] }) => {
					setMemberId(response.memberId);
					setMessageLogs(response.messageLogs);
					setRoomLoading(false);
				}
			);

			// 실시간 메시지 수신 설정
			socket.on("receive_message", handleReceiveMessage);

			return () => {
				// 소켓 이벤트 핸들러 제거
				socket.off("receive_message", handleReceiveMessage);
			};
		}
	}, [roomId, socket, memberId]);

	const backBtnClick = () => {
		setSelectedRoom(null);
	};

	const chatInputClick = () => {
		if (!message.length) {
			return;
		}

		const msg: IMessage = {
			memberId,
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
					name={message.nickname!}
					content={message.message}
				/>
			);
		});
	};

	return (
		<div className={chatRoomContainer}>
			{/* TODO : title zustand에서 꺼내오기 */}
			<ChatRoomHeader
				title={title}
				onClick={backBtnClick}
			/>
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
