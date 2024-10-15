import { ChangeEvent, FC, useMemo, useState } from "react";
import NicknameForm from "../../component/User/NicknameForm";
import PasswordForm from "../../component/User/PasswordForm";
import {
	buttonsWrapper,
	cancleButton,
	profileUpdateForm,
	profileUpdateWrapper,
} from "./ProfileUpdate.css";
import SubmitButton from "../../component/User/SubmitButton";
import { ERROR_MESSAGE, REGEX } from "./constants/constants";
import ErrorMessageForm from "../../component/User/ErrorMessageForm";
import { sendPutUpdateUserRequest } from "../../api/users/crud";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "../../state/store";
import { ApiCall } from "../../api/api";
import { ClientError } from "../../api/errors";
import { useStringWithValidation } from "../../hook/useStringWithValidation";
import {
	applySubmitButtonStyle,
	submitButtonStyle,
} from "../../component/User/css/SubmitButton.css";
import { useGlobalErrorModal } from "../../state/GlobalErrorModalStore";

interface IProfileUpdatePayload {
	email?: string | undefined;
	nickname: string;
	password: string;
}

interface IProfileUpdateResult {
	status: number;
	message: string;
}

const ProfileUpdate: FC = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const searchParams = new URLSearchParams(location.search);
	const final = searchParams.get("final");

	const nickname = useStringWithValidation();
	const password = useStringWithValidation();
	const requiredPassword = useStringWithValidation();
	const [errorMessage, setErrorMessage] = useState("");

	const globalErrorModal = useGlobalErrorModal();

	const { setNickName: storeSetNickName } = useUserStore.use.actions();

	const storeNickName = useUserStore.use.nickname();
	const isEmailRegistered = useUserStore.use.isEmailRegistered();

	const handleError = (err: ClientError) => {
		if (err.code === 400) {
			let message: string = err.message;
			message = message.replace("Bad Request: ", "");
			setErrorMessage(message);
			return;
		}

		if (
			err.code === 401 &&
			err.message === "Unauthorized: 로그인이 필요합니다."
		) {
			globalErrorModal.open({
				title: "오류",
				message: "로그인이 필요합니다.",
			});
			navigate("/login");
			return;
		}

		if (err.code !== 200) {
			globalErrorModal.open({
				title: "오류",
				message: "로그인 정보가 만료되었거나 유효하지 않습니다.",
			});
			navigate(`/checkPassword?next=profileUpdate&final=${final}`);
			return;
		}
	};

	const handleNicknameChange = (e: ChangeEvent<HTMLInputElement>) => {
		nickname.setValue(e.target.value, (value, _pass, fail) => {
			if (value === storeNickName) {
				fail("현재 닉네임과 동일합니다.");
			} else {
				fail("");
			}
		});
	};

	const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
		password.setValue(e.target.value, (value, pass, fail) => {
			if (REGEX.PASSWORD.test(value)) {
				pass();
			} else {
				fail(ERROR_MESSAGE.PASSWORD_REGEX);
			}
		});

		requiredPassword.setValidation((value, pass, fail) => {
			if (!value) {
				fail("");
			} else if (e.target.value === value) {
				pass();
			} else {
				fail(ERROR_MESSAGE.PASSWORD_MISMATCH);
			}
		});
	};

	const handleRequiredPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
		requiredPassword.setValue(e.target.value, (value, pass, fail) => {
			if (password.value === value) {
				pass();
			} else {
				fail(ERROR_MESSAGE.PASSWORD_MISMATCH);
			}
		});
	};

	const btnApply = useMemo(
		() =>
			nickname.isValid &&
			(!isEmailRegistered ||
				(password.isValid && requiredPassword.isValid)),
		[
			isEmailRegistered,
			nickname.isValid,
			password.isValid,
			requiredPassword.isValid,
		]
	);

	const checkNicknameDuplication = () => {
		nickname.setValidation((value, pass, fail) => {
			if (!REGEX.NICKNAME.test(value)) {
				fail(ERROR_MESSAGE.NICKNAME_REGEX);
				return;
			}

			// TODO : api 호출해서 중복 확인

			pass();
		});
	};

	// TODO: 닉네임, 비밀번호를 따로 변경할 수 있도록 서버, 클라이언트 수정 필요.
	//       현재는 비밀번호가 없는 유저의 닉네임을 변경할 수 없음.
	const handleSubmit = async () => {
		const result: IProfileUpdateResult = await ApiCall(() => {
			const payload: IProfileUpdatePayload = {
				nickname: nickname.value,
				password: password.value,
			};

			return sendPutUpdateUserRequest(payload);
		}, handleError);

		if (result instanceof ClientError) {
			return;
		}

		navigate(final || "/");

		storeSetNickName(nickname.value);

		globalErrorModal.open({
			variant: "info",
			title: "성공",
			message: "유저 정보가 변경되었습니다.",
		});
	};

	const handleCancle = () => {
		navigate(final || "/");
	};

	return (
		<div className={profileUpdateWrapper}>
			<h1>유저 정보 수정</h1>

			<div className={profileUpdateForm}>
				<NicknameForm
					labelText="변경할 닉네임"
					nickname={nickname.value}
					onChange={handleNicknameChange}
					errorMessage={nickname.errorMessage}
					isValid={nickname.isValid}
					isDuplicateCheck={true}
					duplicationCheckFunc={checkNicknameDuplication}
				/>
				{isEmailRegistered && (
					<>
						<PasswordForm
							labelText={"변경할 비밀번호"}
							password={password.value}
							onChange={handlePasswordChange}
							errorMessage={password.errorMessage}
							isValid={password.isValid}
						/>
						<PasswordForm
							labelText={"비밀번호 확인"}
							id="requiredPassword"
							password={requiredPassword.value}
							onChange={handleRequiredPasswordChange}
							errorMessage={requiredPassword.errorMessage}
							isValid={requiredPassword.isValid}
						/>
					</>
				)}
				{errorMessage && (
					<ErrorMessageForm>{errorMessage}</ErrorMessageForm>
				)}

				<div className={buttonsWrapper}>
					<button
						className={cancleButton}
						onClick={handleCancle}
					>
						취소
					</button>
					<SubmitButton
						className={
							btnApply
								? applySubmitButtonStyle
								: submitButtonStyle
						}
						onClick={handleSubmit}
						apply={btnApply}
					>
						유저 정보 변경
					</SubmitButton>
				</div>
			</div>
		</div>
	);
};

export default ProfileUpdate;
