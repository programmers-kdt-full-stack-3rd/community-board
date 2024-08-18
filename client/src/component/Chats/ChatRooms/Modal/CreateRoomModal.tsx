import React, { SetStateAction, useState } from "react";
import {
	ApplyBtn,
	CloseBtn,
	FilterBtn,
	InputContainer,
	InputIndex,
	ModalBody,
	ModalContainer,
	ModalHeader,
	PasswordInput,
	PostBtn,
	PostHeaderTitle,
	TitleInput,
} from "./CreateRoomModal.css";
import { ICreateRoomRequest } from "shared";

interface Props {
	close: React.Dispatch<SetStateAction<boolean>>;
}

const CreateRoomModal: React.FC<Props> = ({ close }) => {
	const [roomInfo, setRoomInfo] = useState<ICreateRoomRequest>({
		title: "",
		password: "",
		isPrivate: false,
	});

	return (
		<div className={ModalContainer}>
			<div className={ModalHeader}>
				<button
					className={PostBtn}
					onClick={() => {
						// TODO : 방 생성
						close(false);
					}}
				>
					생성
				</button>
				<div className={PostHeaderTitle}>채팅방 생성</div>
				<button
					className={CloseBtn}
					onClick={() => close(false)}
				>
					취소
				</button>
			</div>
			<div className={ModalBody}>
				<div className={InputContainer}>
					<div className={InputIndex}>채팅방 이름</div>
					<input
						className={TitleInput}
						value={roomInfo.title}
						onChange={e =>
							setRoomInfo({ ...roomInfo, title: e.target.value })
						}
						placeholder="채팅방 이름을 입력해주세요"
					/>
				</div>
				<div className={InputContainer}>
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							gap: "10px",
						}}
					>
						<button
							className={
								roomInfo.isPrivate ? ApplyBtn : FilterBtn
							}
							onClick={() => {
								if (roomInfo.isPrivate) {
									setRoomInfo({
										...roomInfo,
										password: "",
										isPrivate: false,
									});
								} else {
									setRoomInfo({
										...roomInfo,
										isPrivate: true,
									});
								}
							}}
						>
							비밀 방
						</button>
						{roomInfo.isPrivate && (
							<input
								className={PasswordInput}
								value={roomInfo.password}
								placeholder="비밀번호를 입력해주세요"
								onChange={e =>
									setRoomInfo({
										...roomInfo,
										password: e.target.value,
									})
								}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default CreateRoomModal;
