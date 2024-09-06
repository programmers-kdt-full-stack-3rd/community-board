import { FC, useEffect, useState } from "react";
import EmailForm from "../../component/User/EmailForm";
import PasswordForm from "../../component/User/PasswordForm";
import SubmitButton from "../../component/User/SubmitButton";
import NicknameForm from "../../component/User/NicknameForm";
import { ERROR_MESSAGE, REGEX } from "./constants/constants";
import { joinWrapper } from "./Join.css";

interface ValidateText {
	text: string;
	isValid: boolean;
	isDuplicate?: boolean | null;
	errorMessage: string;
}

const Join: FC = () => {
	const [email, setEmail] = useState<ValidateText>({
		text: "",
		isValid: false,
		isDuplicate: null,
		errorMessage: "",
	});
	const [nickname, setNickname] = useState<ValidateText>({
		text: "",
		isValid: false,
		isDuplicate: null,
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
		const errorMessage = isValid ? "" : ERROR_MESSAGE.PASSWORD_REGEX;

		setPassword({
			...password,
			text: e.target.value,
			isValid: isValid,
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
				/>
				<NicknameForm
					nickname={nickname.text}
					onChange={handleNickname}
					duplicationCheckFunc={checkNicknameDuplication}
					errorMessage={nickname.errorMessage}
				/>
				<PasswordForm
					password={password.text}
					onChange={handlePassword}
					labelText="비밀번호"
					placeholder="10자 이상의 영문 대/소문자, 숫자를 사용"
					errorMessage={password.errorMessage}
				/>
				<PasswordForm
					password={requiredPassword.text}
					id={"requiredPassword"}
					onChange={handleRequiredPassword}
					labelText="비밀번호 확인"
					errorMessage={requiredPassword.errorMessage}
				/>

				<SubmitButton
					onClick={() => {
						console.log("눌럿쪙");
					}}
					apply={btnApply}
				>
					회원 가입
				</SubmitButton>
			</div>
		</div>
	);
};

export default Join;
