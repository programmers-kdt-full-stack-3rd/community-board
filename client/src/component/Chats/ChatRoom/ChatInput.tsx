import React from "react";
import { chatInput, inputContainer, SendButton } from "./ChatRoom.css";

interface Props {
	message: string;
	setMessage: React.Dispatch<React.SetStateAction<string>>;
	onClick: () => void;
}

const ChatInput: React.FC<Props> = ({ message, setMessage, onClick }) => {
	return (
		<div className={inputContainer}>
			<input
				className={chatInput}
				value={message}
				onChange={e => setMessage(e.target.value)}
				onKeyDown={e => {
					if (e.key === "Enter") {
						onClick();
					}
				}}
			/>
			<button
				className={SendButton}
				onClick={onClick}
			>
				Send
			</button>
		</div>
	);
};

export default ChatInput;
