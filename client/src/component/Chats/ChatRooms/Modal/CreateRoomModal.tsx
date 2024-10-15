import React, { useState } from "react";
import { ICreateRoomResponse } from "shared";
import { ApiCall } from "../../../../api/api";
import { sendCreateRoomRequest } from "../../../../api/chats/crud";
import { useGlobalErrorModal } from "../../../../state/GlobalErrorModalStore";
import Modal from "../../../common/Modal/Modal";
import Button from "../../../common/Button";
import TextInput from "../../../common/TextInput";
import { useChatAside } from "../../../../state/ChatAsideStore";

interface Props {
	onAccept: (room: { title: string; roomId: number }) => void;
	onClose: () => void;
}

const CreateRoomModal: React.FC<Props> = ({ onAccept, onClose }) => {
	const [roomTitle, setRoomTitle] = useState("");
	const [roomPassword, setRoomPassword] = useState("");
	const [isRoomPrivate, setIsRoomPrivate] = useState(false);

	const { chatModalContainer } = useChatAside();
	const globalErrorModal = useGlobalErrorModal();

	const createRoom = async () => {
		const res: ICreateRoomResponse | Error = await ApiCall(
			() =>
				sendCreateRoomRequest({
					title: roomTitle,
					password: isRoomPrivate ? roomPassword : "",
					isPrivate: isRoomPrivate,
				}),
			err =>
				globalErrorModal.openWithMessageSplit({
					messageWithTitle: err.message,
				})
		);

		if (res instanceof Error) {
			return;
		}

		onAccept({
			roomId: parseInt(res.roomId, 10),
			title: roomTitle,
		});
	};

	return (
		<Modal
			container={chatModalContainer ?? undefined}
			isOpen={true}
			onClose={onClose}
		>
			<Modal.Title>채팅방 생성</Modal.Title>

			<Modal.Body>
				<div className="flex flex-col gap-6">
					<TextInput
						label="채팅방 이름"
						type="text"
						id="room-name"
						value={roomTitle}
						onChange={e => setRoomTitle(e.target.value)}
						placeholder="새 채팅방 이름을 입력하세요."
					/>

					<div className="flex h-10 gap-3">
						<Button
							color={isRoomPrivate ? "primary" : "neutral"}
							variant={isRoomPrivate ? "solid" : "outline"}
							onClick={() => setIsRoomPrivate(prev => !prev)}
						>
							비밀 방
						</Button>

						{isRoomPrivate && (
							<TextInput
								wrapperClassName="w-full"
								type="password"
								id="room-password"
								value={roomPassword}
								placeholder="비밀번호를 입력하세요."
								onChange={e => setRoomPassword(e.target.value)}
							/>
						)}
					</div>
				</div>
			</Modal.Body>

			<Modal.Footer>
				<Button
					variant="outline"
					onClick={onClose}
				>
					취소
				</Button>

				<Button
					color="action"
					onClick={createRoom}
				>
					생성
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default CreateRoomModal;
