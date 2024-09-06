import { FC, useEffect, useState } from "react";
import EmailForm from "../../component/User/EmailForm";
import PasswordForm from "../../component/User/PasswordForm";
import SubmitButton from "../../component/User/SubmitButton";
import NicknameForm from "../../component/User/NicknameForm";
import { ERROR_MESSAGE, REGEX } from "./constants/constants";
import { joinWrapper } from "./Join.css";
import {
	applySubmitButtonStyle,
	submitButtonStyle,
} from "../../component/User/css/SubmitButton.css";
import { ClientError } from "../../api/errors";
import { ApiCall } from "../../api/api";
import { sendPostJoinRequest } from "../../api/users/crud";
import { useNavigate } from "react-router-dom";

export interface ValidateText {
	text: string;
	isValid: boolean;
	errorMessage: string;
}

const Join: FC = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState<ValidateText>({
		text: "",
		isValid: false,
		errorMessage: "",
	});
	const [nickname, setNickname] = useState<ValidateText>({
		text: "",
		isValid: false,
		errorMessage: "",
	});
	const [password, setPassword] = useState<ValidateText>({
		text: "",
		isValid: false,
		errorMessage: "",
	});
	const [requiredPassword, setRequiredPassword] = useState<ValidateText>({
		text: "",
		isValid: false,
		errorMessage: "",
	});

	const [btnApply, setBtnApply] = useState<boolean>(false);

	const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail({
			...email,
			text: e.target.value,
			isValid: false,
			errorMessage: "",
		});
	};

	const handleNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNickname({
			...nickname,
			text: e.target.value,
			isValid: false,
			errorMessage: "",
		});
	};

	const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
		const isValid = REGEX.PASSWORD.test(e.target.value);
		const errorMessage1 = isValid ? "" : ERROR_MESSAGE.PASSWORD_REGEX;

		setPassword({
			...password,
			text: e.target.value,
			isValid: isValid,
			errorMessage: errorMessage1,
		});

		const isSame = e.target.value === requiredPassword.text;
		const errorMessage = isSame ? "" : ERROR_MESSAGE.PASSWORD_MISMATCH;

		setRequiredPassword({
			...requiredPassword,
			isValid: isSame,
			errorMessage: errorMessage,
		});
	};

	const handleRequiredPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
		const isValid = password.text === e.target.value;
		const errorMessage = isValid ? "" : ERROR_MESSAGE.PASSWORD_MISMATCH;

		setRequiredPassword({
			...requiredPassword,
			text: e.target.value,
			isValid: isValid,
			errorMessage: errorMessage,
		});
	};

	useEffect(() => {
		if (
			email.isValid &&
			nickname.isValid &&
			password.isValid &&
			requiredPassword.isValid
		) {
			setBtnApply(true);
		} else {
			setBtnApply(false);
		}
	}, [
		email.isValid,
		nickname.isValid,
		password.isValid,
		requiredPassword.isValid,
	]);

	const checkEmailDuplication = () => {
		if (!REGEX.EMAIL.test(email.text)) {
			setEmail({
				...email,
				errorMessage: ERROR_MESSAGE.EMAIL_REGEX,
			});
			return;
		}

		// TODO : api 호출해서 중복 확인

		setEmail({ ...email, isValid: true });
	};

	const checkNicknameDuplication = () => {
		if (!REGEX.NICKNAME.test(nickname.text)) {
			setNickname({
				...nickname,
				errorMessage: ERROR_MESSAGE.NICKNAME_REGEX,
			});
			return;
		}

		// TODO : api 호출해서 중복 확인

		setNickname({ ...nickname, isValid: true });
	};

	const submitJoin = async () => {
		const body = {
			email: email.text,
			nickname: nickname.text,
			password: password.text,
			requiredPassword: requiredPassword.text,
		};

		const errorHandle = (err: ClientError) => {
			if (err.code === 400) {
				if (err.message) {
					let message: string = err.message;
					message = message.replace("Bad Request: ", "");
					console.log(message);
				}
			}
		};

		const result = await ApiCall(
			() => sendPostJoinRequest(body),
			errorHandle
		);

		if (result instanceof ClientError) {
			return;
		}

		if (result) {
			alert("회원가입이 완료되었습니다.");
			navigate("/login");
		}
	};

	return (
		<div className={joinWrapper}>
			<h1>회원가입</h1>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "10px",
				}}
			>
				<EmailForm
					email={email.text}
					onChange={handleEmail}
					duplicationCheckFunc={checkEmailDuplication}
					errorMessage={email.errorMessage}
					isValid={email.isValid}
					isDuplicateCheck={true}
				/>
				<NicknameForm
					nickname={nickname.text}
					labelText="닉네임"
					onChange={handleNickname}
					duplicationCheckFunc={checkNicknameDuplication}
					errorMessage={nickname.errorMessage}
					isValid={nickname.isValid}
					isDuplicateCheck={true}
				/>
				<PasswordForm
					password={password.text}
					onChange={handlePassword}
					labelText="비밀번호"
					placeholder="10자 이상의 영문 대/소문자, 숫자를 사용"
					errorMessage={password.errorMessage}
					isValid={password.isValid}
				/>
				<PasswordForm
					password={requiredPassword.text}
					id={"requiredPassword"}
					onChange={handleRequiredPassword}
					labelText="비밀번호 확인"
					errorMessage={requiredPassword.errorMessage}
					isValid={requiredPassword.isValid}
				/>

				<SubmitButton
					className={
						btnApply ? applySubmitButtonStyle : submitButtonStyle
					}
					onClick={submitJoin}
					apply={btnApply}
				>
					회원 가입
				</SubmitButton>
			</div>
		</div>
	);
};

export default Join;
