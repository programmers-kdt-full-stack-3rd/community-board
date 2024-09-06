import { FC, useState } from "react";
import EmailForm from "../../component/User/EmailForm";
import PasswordForm from "../../component/User/PasswordForm";
import SubmitButton from "../../component/User/SubmitButton";
import NicknameForm from "../../component/User/NicknameForm";
import ErrorMessageForm from "../../component/User/ErrorMessageForm";
import { REGEX } from "./constants/constants";
import { joinWrapper } from "./Join.css";
import { sendPostJoinRequest } from "../../api/users/crud";
import { useNavigate } from "react-router-dom";
import { ClientError } from "../../api/errors";
import { ApiCall } from "../../api/api";

interface ValidationResult {
	isValid: boolean;
	errorMessage: string;
	invalidField?: "email" | "password" | "requiredPassword" | "nickname";
}

const createError = (
	message: string,
	field: ValidationResult["invalidField"]
): ValidationResult => ({
	isValid: false,
	errorMessage: message,
	invalidField: field,
});

const validateJoin = (
	email: string,
	password: string,
	requiredPassword: string,
	nickname: string
): ValidationResult => {
	const emailRegex = REGEX.EMAIL;
	const passwordRegex = REGEX.PASSWORD;

	if (!email) {
		return createError("이메일을 입력하세요.", "email");
	}

	if (!emailRegex.test(email)) {
		return createError("이메일 형식이 올바르지 않습니다.", "email");
	}

	if (!password) {
		return createError("비밀번호를 입력하세요.", "password");
	}

	if (!passwordRegex.test(password)) {
		return createError(
			"비밀번호: 10자 이상의 영문 대/소문자, 숫자를 사용해 주세요.",
			"password"
		);
	}

	if (!requiredPassword) {
		return createError("비밀번호 확인을 입력하세요.", "requiredPassword");
	}

	if (password !== requiredPassword) {
		return createError("비밀번호가 일치하지 않습니다.", "requiredPassword");
	}

	if (!nickname) {
		return createError("닉네임을 입력하세요.", "nickname");
	}

	return {
		isValid: true,
		errorMessage: "",
	};
};

const Join: FC = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [requiredPassword, setRequiredPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [nickname, setNickname] = useState("");
	const [invalidField, setInvalidField] =
		useState<ValidationResult["invalidField"]>();

	const navigate = useNavigate();

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};

	const handleRequiredPasswordChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setRequiredPassword(e.target.value);
	};

	const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNickname(e.target.value);
	};

	const handleJoinButton = async () => {
		const validateResult = validateJoin(
			email,
			password,
			requiredPassword,
			nickname
		);

		setErrorMessage(validateResult.errorMessage);
		setInvalidField(validateResult.invalidField);

		if (validateResult.isValid) {
			const body = {
				email,
				password,
				requiredPassword,
				nickname,
			};

			const errorHandle = (err: ClientError) => {
				if (err.code === 400) {
					if (err.message) {
						let message: string = err.message;
						message = message.replace("Bad Request: ", "");
						if (message.includes("이메일")) {
							setInvalidField("email");
						} else if (message.includes("닉네임")) {
							setInvalidField("nickname");
						}

						setErrorMessage(message);
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
		}
	};

	return (
		<div className={joinWrapper}>
			<h1>회원가입</h1>
			<EmailForm
				email={email}
				onChange={handleEmailChange}
				isValid={invalidField !== "email"}
			/>
			<PasswordForm
				password={password}
				onChange={handlePasswordChange}
				labelText="비밀번호"
				isValid={invalidField !== "password"}
				placeholder="10자 이상의 영문 대/소문자, 숫자를 사용"
			/>
			<PasswordForm
				password={requiredPassword}
				id={"requiredPassword"}
				onChange={handleRequiredPasswordChange}
				labelText="비밀번호 확인"
				isValid={invalidField !== "requiredPassword"}
			/>
			<NicknameForm
				nickname={nickname}
				onChange={handleNicknameChange}
				labelText="닉네임"
				isValid={invalidField !== "nickname"}
			/>

			{errorMessage && (
				<ErrorMessageForm>{errorMessage}</ErrorMessageForm>
			)}

			<SubmitButton onClick={handleJoinButton}>회원 가입</SubmitButton>
		</div>
	);
};

export default Join;
