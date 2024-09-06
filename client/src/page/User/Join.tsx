import { FC, useEffect, useState } from "react";
import EmailForm from "../../component/User/EmailForm";
import PasswordForm from "../../component/User/PasswordForm";
import SubmitButton from "../../component/User/SubmitButton";
import NicknameForm from "../../component/User/NicknameForm";
import { ERROR_MESSAGE, REGEX } from "./constants/constants";
import { joinWrapper } from "./Join.css";

// interface ValidationResult {
// 	isValid: boolean;
// 	errorMessage: string;
// 	invalidField?: "email" | "password" | "requiredPassword" | "nickname";
// }

interface ValidateText {
	text: string;
	isValid: boolean;
	isDuplicate?: boolean | null;
	errorMessage: string;
}

// const createError = (
// 	message: string,
// 	field: ValidationResult["invalidField"]
// ): ValidationResult => ({
// 	isValid: false,
// 	errorMessage: message,
// 	invalidField: field,
// });

// const validateJoin = (
// 	email: string,
// 	password: string,
// 	requiredPassword: string,
// 	nickname: string
// ): ValidationResult => {
// 	const emailRegex = REGEX.EMAIL;
// 	const passwordRegex = REGEX.PASSWORD;

// 	if (!email) {
// 		return createError("이메일을 입력하세요.", "email");
// 	}

// 	if (!emailRegex.test(email)) {
// 		return createError("이메일 형식이 올바르지 않습니다.", "email");
// 	}

// 	if (!password) {
// 		return createError("비밀번호를 입력하세요.", "password");
// 	}

// 	if (!passwordRegex.test(password)) {
// 		return createError(
// 			"비밀번호: 10자 이상의 영문 대/소문자, 숫자를 사용해 주세요.",
// 			"password"
// 		);
// 	}

// 	if (!requiredPassword) {
// 		return createError("비밀번호 확인을 입력하세요.", "requiredPassword");
// 	}

// 	if (password !== requiredPassword) {
// 		return createError("비밀번호가 일치하지 않습니다.", "requiredPassword");
// 	}

// 	if (!nickname) {
// 		return createError("닉네임을 입력하세요.", "nickname");
// 	}

// 	return {
// 		isValid: true,
// 		errorMessage: "",
// 	};
// };

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

	// handel func -----

	const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail({ ...email, text: e.target.value, isValid: false });
	};

	const handleNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNickname({ ...nickname, text: e.target.value, isValid: false });
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
					isValid={email.isValid}
					duplicationCheckFunc={checkEmailDuplication}
				/>
				<NicknameForm
					nickname={nickname.text}
					onChange={handleNickname}
					isValid={nickname.isValid}
					duplicationCheckFunc={checkNicknameDuplication}
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
