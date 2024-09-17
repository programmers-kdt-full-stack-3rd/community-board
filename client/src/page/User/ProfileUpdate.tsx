import { ChangeEvent, FC, useEffect, useMemo, useState } from "react";
import { mapResponseToNonSensitiveUser } from "shared";
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
import { getUserMyself, sendPutUpdateUserRequest } from "../../api/users/crud";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "../../state/store";
import { ApiCall } from "../../api/api";
import { ClientError } from "../../api/errors";
import EmailForm from "../../component/User/EmailForm";
import { useStringWithValidation } from "../../hook/useStringWithValidation";
import {
	applySubmitButtonStyle,
	submitButtonStyle,
} from "../../component/User/css/SubmitButton.css";

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

	const [hasEmail, setHasEmail] = useState(true);
	const email = useStringWithValidation();
	const nickname = useStringWithValidation();
	const password = useStringWithValidation();
	const requiredPassword = useStringWithValidation();
	const [errorMessage, setErrorMessage] = useState("");

	const { setNickName: storeSetNickName } = useUserStore.use.actions();

	const storeNickName = useUserStore.use.nickname();

	useEffect(() => {
		ApiCall(
			() => getUserMyself(),
			err => console.error("내 정보 조회 실패", err)
		).then(response => {
			if (response instanceof Error) {
				return;
			}

			const user = mapResponseToNonSensitiveUser(response);
			setHasEmail(!!user.email);
		});
	}, []);

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
			alert("로그인이 필요합니다.");
			navigate("/login");
			return;
		}

		if (err.code !== 200) {
			alert("검증되지 않은 유저 입니다.");
			navigate(`/checkPassword?next=profileUpdate&final=${final}`);
			return;
		}
	};

	const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
		email.setValue(e.target.value);
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
			(hasEmail || email.isValid) &&
			nickname.isValid &&
			password.isValid &&
			requiredPassword.isValid,
		[
			hasEmail,
			email.isValid,
			nickname.isValid,
			password.isValid,
			requiredPassword.isValid,
		]
	);

	const checkEmailDuplication = () => {
		email.setValidation((value, pass, fail) => {
			if (!REGEX.EMAIL.test(value)) {
				fail(ERROR_MESSAGE.EMAIL_REGEX);
				return;
			}

			// TODO : api 호출해서 중복 확인

			pass();
		});
	};

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

	const handleSubmit = async () => {
		const result: IProfileUpdateResult = await ApiCall(() => {
			const payload: IProfileUpdatePayload = {
				nickname: nickname.value,
				password: password.value,
			};

			if (!hasEmail) {
				payload.email = email.value;
			}

			return sendPutUpdateUserRequest(payload);
		}, handleError);

		if (result instanceof ClientError) {
			return;
		}

		navigate(final || "/");

		storeSetNickName(nickname.value);

		alert("유저 정보가 변경되었습니다.");
	};

	const handleCancle = () => {
		navigate(final || "/");
	};

	return (
		<div className={profileUpdateWrapper}>
			<h1>유저 정보 수정</h1>

			<div className={profileUpdateForm}>
				{hasEmail || (
					<EmailForm
						email={email.value}
						onChange={handleEmailChange}
						errorMessage={email.errorMessage}
						isValid={email.isValid}
						isDuplicateCheck={true}
						duplicationCheckFunc={checkEmailDuplication}
					/>
				)}
				<NicknameForm
					labelText="변경할 닉네임"
					nickname={nickname.value}
					onChange={handleNicknameChange}
					errorMessage={nickname.errorMessage}
					isValid={nickname.isValid}
					isDuplicateCheck={true}
					duplicationCheckFunc={checkNicknameDuplication}
				/>
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
