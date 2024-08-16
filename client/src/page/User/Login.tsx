import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import googleIcon from "../../assets/icons/google-icon.svg";
import naverIcon from "../../assets/icons/naver-icon.svg";
import kakaoIcon from "../../assets/icons/kakao-icon.svg";
import {
	loginContainer,
	socialLoginButtons,
	googleButton,
	kakaoButton,
	naverButton,
	iconStyle,
	joinLink,
} from "../../page/User/Login.css";
import { REGEX } from "./constants/constants";
import EmailForm from "../../component/User/EmailForm";
import PasswordForm from "../../component/User/PasswordForm";
import ErrorMessageForm from "../../component/User/ErrorMessageForm";
import SubmitButton from "../../component/User/SubmitButton";
import { useUserStore } from "../../state/store";
import { ApiCall } from "../../api/api";
import { ClientError } from "../../api/errors";
import { sendPostLoginRequest } from "../../api/users/crud";

interface ValidationResult {
	isValid: boolean;
	errorMessage: string;
	invalidFields: ("email" | "password")[];
}

const createError = (
	message: string,
	fields: ("email" | "password")[]
): ValidationResult => ({
	isValid: false,
	errorMessage: message,
	invalidFields: fields,
});

const validateLogin = (email: string, password: string): ValidationResult => {
	const emailRegex = REGEX.EMAIL;
	const passwordRegex = REGEX.PASSWORD;

	if (!email) {
		return createError("이메일을 입력하세요.", ["email"]);
	}

	if (!password) {
		return createError("비밀번호를 입력하세요.", ["password"]);
	}

	if (!emailRegex.test(email) || !passwordRegex.test(password)) {
		return createError("이메일 또는 비밀번호가 틀렸습니다.", [
			"email",
			"password",
		]);
	}

	return {
		isValid: true,
		errorMessage: "",
		invalidFields: [],
	};
};

const Login: React.FC = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [invalidFields, setInvalidFields] = useState<
		("email" | "password")[]
	>([]);

	const { setLoginUser } = useUserStore.use.actions();

	// zustand 테스트용
	// const stateNickName = useUserStore.use.nickname();
	// const stateLoginTime = useUserStore.use.loginTime();
	// const stateIsLogin = useUserStore.use.isLogin();

	const navigate = useNavigate();
	const location = useLocation();

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};

	const handleLoginButton = async () => {
		const validateResult = validateLogin(email, password);

		setErrorMessage(validateResult.errorMessage);
		setInvalidFields(validateResult.invalidFields);

		if (validateResult.isValid) {
			const body = {
				email,
				password,
			};

			const errorHandle = (err: ClientError) => {
				if (err.message) {
					let message: string = err.message;
					message = message.replace("Bad Request: ", "");
					if (message.includes("또는")) {
						setInvalidFields(["email", "password"]);
						setErrorMessage(message);
						return;
					}

					if (message.includes("이메일")) {
						setInvalidFields(["email"]);
						setErrorMessage(message);
						return;
					}
					setErrorMessage(message);
				}
			};

			const result = await ApiCall(
				() => sendPostLoginRequest(body),
				errorHandle
			);

			if (result instanceof ClientError) {
				return;
			}

			if (result.result) {
				const { nickname, loginTime } = result.result;

				setLoginUser(nickname, loginTime);

				const redirect =
					new URLSearchParams(location.search).get("redirect") || "/";
				navigate(redirect);
			}
		}
	};

	const handleGoogleLogin = () => {
		alert("구글 로그인 구현 예정");
		navigate("/");
	};

	const handleKakaoLogin = () => {
		alert("카카오 로그인 구현 예정");
		navigate("/");
	};

	const handleNaverLogin = () => {
		alert("네이버 로그인 구현 예정");
		navigate("/");
	};

	return (
		<div className={loginContainer}>
			<h2>로그인</h2>
			<div>
				<EmailForm
					email={email}
					onChange={handleEmailChange}
					isValid={!invalidFields.includes("email")}
				/>
				<PasswordForm
					password={password}
					onChange={handlePasswordChange}
					labelText="비밀번호"
					isValid={!invalidFields.includes("password")}
				/>
				{errorMessage && (
					<ErrorMessageForm>{errorMessage}</ErrorMessageForm>
				)}
				<SubmitButton onClick={handleLoginButton}>
					로그인 버튼
				</SubmitButton>
				<p>
					계정이 없으신가요?
					<a
						href="/join"
						className={joinLink}
					>
						계정생성
					</a>
				</p>
			</div>
			{
				// zustand 테스트용
				/* <div>
        <p>zustand 테스트</p>
        <p>nickName: {stateNickName}</p>
        <p>loginTime: {stateLoginTime}</p>
        <p>isLogin: {stateIsLogin ? "로그인됨" : "로그아웃됨"}</p>
      </div> */
			}

			<div className={socialLoginButtons}>
				<button
					className={googleButton}
					onClick={handleGoogleLogin}
				>
					<img
						src={googleIcon}
						alt="Google Icon"
						className={iconStyle}
					/>
					구글로 로그인
				</button>
				<button
					className={naverButton}
					onClick={handleNaverLogin}
				>
					<img
						src={naverIcon}
						alt="Naver Icon"
						className={iconStyle}
					/>
					네이버로 로그인
				</button>
				<button
					className={kakaoButton}
					onClick={handleKakaoLogin}
				>
					<img
						src={kakaoIcon}
						alt="Kakao Icon"
						className={iconStyle}
					/>
					카카오로 로그인
				</button>
			</div>
		</div>
	);
};

export default Login;
