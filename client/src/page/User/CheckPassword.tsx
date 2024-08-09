import { FC, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
	sendDeleteUserRequest,
	sendPOSTCheckPasswordRequest,
} from "../../api/users/crud";
import PasswordForm from "../../component/User/PasswordForm";
import SubmitButton from "../../component/User/SubmitButton";
import { checkPasswordWrapper } from "./CheckPassword.css";
import { REGEX } from "./constants/constants";
import { useModal } from "../../hook/useModal";
import UserDeleteModal from "../../component/Header/UserDeleteModal";
import { useUserStore } from "../../state/store";
import { ClientError } from "../../api/errors";
import { ApiCall } from "../../api/api";

const MODAL_CONFIGS = {
	final: {
		title: "회원 탈퇴 최종 확인",
		message: "정말로 탈퇴하시겠습니까?",
		cancelText: "취소",
		confirmText: "탈퇴 확정",
		isWarning: true,
	},
};
const CheckPassword: FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [password, setPassword] = useState("");

	const searchParams = new URLSearchParams(location.search);
	const next = searchParams.get("next");
	const final = searchParams.get("final");

	const { setLogoutUser } = useUserStore.use.actions();

	const finalModal = useModal();

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};

	const handleSubmit = async () => {
		if (!password) {
			alert("비밀번호를 입력하세요.");
			return;
		}
		if (REGEX.PASSWORD.test(password) === false) {
			alert("비밀번호가 일치하지 않습니다.");
			setPassword("");
			return;
		}

		const errorHandle = (err: ClientError) => {
			if (err.code === 400) {
				alert("비밀번호가 일치하지 않습니다.");
				setPassword("");
				return;
			}

			if (err.code === 401) {
				alert("로그인이 필요합니다.");
				navigate("/login");
				return;
			}
		};

		const result = await ApiCall(
			() => sendPOSTCheckPasswordRequest({ password }),
			errorHandle
		);

		if (result instanceof ClientError) {
			return;
		}

		if (next === "accountDelete") {
			finalModal.open();
			return;
		}

		navigate(`/${next}?final=${final}`);
	};

	const handleFinalConfirm = async () => {
		const errorHandle = () => {
			alert("회원 탈퇴에 실패했습니다.");
			navigate(`/`);
			return;
		};

		const result = await ApiCall(
			() => sendDeleteUserRequest(),
			errorHandle
		);

		if (result instanceof ClientError) {
			return;
		}

		finalModal.close();
		alert("회원 탈퇴가 완료되었습니다.");

		setLogoutUser();
		navigate(`/`);
	};

	return (
		<>
			<div className={checkPasswordWrapper}>
				<PasswordForm
					labelText="비밀번호 재확인"
					password={password}
					onChange={handlePasswordChange}
				/>
				<SubmitButton onClick={handleSubmit}>확인</SubmitButton>
			</div>

			<UserDeleteModal
				{...MODAL_CONFIGS.final}
				isOpen={finalModal.isOpen}
				onClose={finalModal.close}
				onConfirm={handleFinalConfirm}
			/>
		</>
	);
};

export default CheckPassword;
