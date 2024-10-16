import { FC, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
	sendDeleteUserRequest,
	sendPOSTCheckPasswordRequest,
} from "../../api/users/crud";
import PasswordForm from "../../component/User/PasswordForm";
import SubmitButton from "../../component/User/SubmitButton";

import { REGEX } from "./constants/constants";
import { useModal } from "../../hook/useModal";
import { useUserStore } from "../../state/store";
import { ClientError } from "../../api/errors";
import { ApiCall } from "../../api/api";
import OAuthLoginButtons from "../../component/User/OAuthLoginButtons";
import ConfirmModal from "../../component/common/Modal/ConfirmModal";
import { useGlobalErrorModal } from "../../state/GlobalErrorModalStore";

const CheckPassword: FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [password, setPassword] = useState("");

	const searchParams = new URLSearchParams(location.search);
	const next = searchParams.get("next");
	const final = searchParams.get("final") || "/";
	const oAuthConfirmed = searchParams.get("oAuthConfirmed");

	const { setLogoutUser } = useUserStore.use.actions();
	const isEmailRegistered = useUserStore.use.isEmailRegistered();

	const globalErrorModal = useGlobalErrorModal();
	const accountDeleteModal = useModal();

	useLayoutEffect(() => {
		if (next === "accountDelete" && oAuthConfirmed === "true") {
			accountDeleteModal.open();
		}
	}, [next, oAuthConfirmed]);

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};

	const handleSubmit = async () => {
		if (!password) {
			globalErrorModal.open({
				title: "오류",
				message: "비밀번호를 입력하세요.",
			});
			return;
		}
		if (REGEX.PASSWORD.test(password) === false) {
			globalErrorModal.open({
				title: "오류",
				message: "비밀번호가 일치하지 않습니다.",
			});
			setPassword("");
			return;
		}

		const errorHandle = (err: ClientError) => {
			if (err.code === 400) {
				globalErrorModal.open({
					title: "오류",
					message: "비밀번호가 일치하지 않습니다.",
				});
				setPassword("");
				return;
			}

			if (err.code === 401) {
				globalErrorModal.open({
					title: "오류",
					message: "로그인이 필요합니다.",
				});
				navigate("/login");
				return;
			}
		};

		const result = await ApiCall(
			() => sendPOSTCheckPasswordRequest({ password }),
			errorHandle
		);

		if (result instanceof Error) {
			return;
		}

		if (!next) {
			globalErrorModal.open({
				title: "오류",
				message: "비밀번호 재확인 이후 진행할 동작이 없습니다.",
			});
			navigate("/");
			return;
		} else if (next === "accountDelete") {
			accountDeleteModal.open();
			return;
		}

		navigate(`/${next}?final=${final}`);
	};

	const handleAccountDeleteAccept = async () => {
		const errorHandle = () => {
			globalErrorModal.open({
				title: "오류",
				message: "회원 탈퇴에 실패했습니다.",
			});
			navigate(`/`);
			return;
		};

		const result = await ApiCall(
			() => sendDeleteUserRequest(),
			errorHandle
		);

		if (result instanceof Error) {
			return;
		}

		accountDeleteModal.close();
		globalErrorModal.open({
			variant: "warning",
			title: "회원 탈퇴 완료",
			message: "회원 탈퇴를 완료했습니다.",
		});

		setLogoutUser();
		navigate(`/`);
	};

	return (
		<div className="dark:bg-customGray mx-auto w-full max-w-[350px] rounded-lg bg-gray-200 p-5 shadow-md">
			<ConfirmModal
				variant="warning"
				isOpen={accountDeleteModal.isOpen}
				okButtonColor="danger"
				okButtonLabel="탈퇴 확정"
				onAccept={handleAccountDeleteAccept}
				onClose={accountDeleteModal.close}
			>
				<ConfirmModal.Title>회원 탈퇴 최종 확인</ConfirmModal.Title>

				<ConfirmModal.Body>
					<p>
						회원 탈퇴 이후에는 같은 이메일이나 소셜 계정으로
						재가입할 수 없습니다.
					</p>
					<p>회원 탈퇴를 확정할까요?</p>
				</ConfirmModal.Body>
			</ConfirmModal>

			<div>
				{isEmailRegistered ? (
					<>
						<PasswordForm
							labelText="비밀번호 재확인"
							password={password}
							onChange={handlePasswordChange}
						/>
						<SubmitButton onClick={handleSubmit}>확인</SubmitButton>
					</>
				) : (
					<>
						<p className="m-0 text-left text-[15px] font-bold">
							소셜 로그인으로 계정 소유 확인
						</p>
						<OAuthLoginButtons loginType="reconfirm" />
					</>
				)}
			</div>
		</div>
	);
};

export default CheckPassword;
