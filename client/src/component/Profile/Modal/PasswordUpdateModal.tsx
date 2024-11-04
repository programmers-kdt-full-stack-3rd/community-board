import { SetStateAction, useState } from "react";
import { FiX } from "react-icons/fi";
import Button from "../../common/Button";
import { IUpdatePasswordRequest } from "shared";
import { sendPatchPasswordRequest } from "../../../api/users/crud";
import { useGlobalErrorModal } from "../../../state/GlobalErrorModalStore";
import { useModal } from "../../../hook/useModal";
import AlertModal from "../../common/Modal/AlertModal";
import TextInput from "../../common/TextInput";
import { REGEX } from "../../../page/User/constants/constants";
// import { ApiCall } from "../../../api/api";
// import { useGlobalErrorModal } from "../../../state/GlobalErrorModalStore";

interface Props {
	close: React.Dispatch<SetStateAction<boolean>>;
}

const PasswordUpdateModal: React.FC<Props> = ({ close }) => {
	const globalErrorModal = useGlobalErrorModal();
	const alertModal = useModal();

	const [origin, setOrigin] = useState<string>("");
	const [newPsword, setNewPsword] = useState<string>("");
	const [checkPsword, setCheckPsword] = useState<string>("");

	const updatePassword = async () => {
		const body: IUpdatePasswordRequest = {
			originPassword: origin,
			newPassword: newPsword,
		};

		sendPatchPasswordRequest(body).then(res => {
			if (res.error !== "") {
				globalErrorModal.openWithMessageSplit({
					messageWithTitle: res.error,
				});
				return;
			}

			alertModal.open();
		});
	};

	return (
		<div className="dark:bg-customGray absolute left-1/2 top-1/2 z-50 w-[600px] -translate-x-1/2 -translate-y-1/2 transform rounded-[5px] border border-gray-300 bg-white text-center">
			<AlertModal
				isOpen={alertModal.isOpen}
				variant="info"
				okButtonLabel="돌아가기"
				onClose={() => {
					alertModal.close();
					close(false);
				}}
			>
				<AlertModal.Title>안내</AlertModal.Title>

				<AlertModal.Body>
					비밀번호를 성공적으로 변경하였습니다
				</AlertModal.Body>
			</AlertModal>
			<div className="dark:border-white-500 flex h-fit flex-row flex-wrap justify-between border-b border-gray-500 p-[15px]">
				<div className="flex items-center justify-center font-extrabold">
					비밀번호 수정
				</div>
				<FiX
					onClick={() => {
						close(false);
					}}
				/>
			</div>
			<div className="my-5 flex h-full w-full flex-col flex-wrap items-center gap-4 px-5">
				<div className="flex w-full flex-col">
					<TextInput
						label={"현재 비밀번호"}
						value={origin}
						onChange={e => setOrigin(e.target.value)}
						placeholder="현재 비밀번호 입력하기"
						type={"password"}
						isValid={REGEX.PASSWORD.test(origin)}
					/>
				</div>
				<div className="flex w-full flex-col">
					<TextInput
						label={"새 비밀번호"}
						value={newPsword}
						onChange={e => setNewPsword(e.target.value)}
						placeholder="10자 이상의 영문 대/소문자, 숫자를 사용"
						type={"password"}
						isValid={
							origin !== newPsword &&
							REGEX.PASSWORD.test(newPsword)
						}
					/>
				</div>
				<div className="flex w-full flex-col">
					<TextInput
						label={"비밀번호 확인"}
						value={checkPsword}
						onChange={e => setCheckPsword(e.target.value)}
						placeholder="새 비밀번호를 다시 입력해주세요"
						type={"password"}
						isValid={newPsword === checkPsword}
					/>
				</div>
				<div
					style={{
						width: "100%",
						display: "flex",
						justifyContent: "flex-end",
					}}
				>
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							gap: "10px",
						}}
					>
						<Button
							color="danger"
							onClick={() => {
								close(false);
							}}
						>
							취소
						</Button>
						<Button
							color="action"
							className="disabled:bg-customGray"
							onClick={() => {
								updatePassword();
							}}
							disabled={
								!newPsword ||
								origin === newPsword ||
								newPsword !== checkPsword
							}
						>
							저장
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PasswordUpdateModal;
