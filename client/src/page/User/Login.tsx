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
import { ERROR_MESSAGE, REGEX } from "./constants/constants";
import EmailForm from "../../component/User/EmailForm";
import PasswordForm from "../../component/User/PasswordForm";
import SubmitButton from "../../component/User/SubmitButton";
import { useUserStore } from "../../state/store";
import { ApiCall } from "../../api/api";
import { ClientError } from "../../api/errors";
import { sendPostLoginRequest } from "../../api/users/crud";
import { getOAuthLoginUrl } from "../../api/users/oauth";
import { ValidateText } from "./Join";

const Login: React.FC = () => {
	const [email, setEmail] = useState<ValidateText>({
		text: "",
		isValid: false,
		errorMessage: "",
	});
	const [password, setPassword] = useState<ValidateText>({
		text: "",
		isValid: false,
		errorMessage: "",
	});

	const { setLoginUser } = useUserStore.use.actions();

	// zustand 테스트용
	// const stateNickName = useUserStore.use.nickname();
	// const stateLoginTime = useUserStore.use.loginTime();
	// const stateIsLogin = useUserStore.use.isLogin();

	const navigate = useNavigate();
	const location = useLocation();

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const isValid = REGEX.EMAIL.test(e.target.value);
		const errorMessage = isValid ? "" : ERROR_MESSAGE.EMAIL_REGEX;

		setEmail({
			...email,
			text: e.target.value,
			isValid: isValid,
			errorMessage: errorMessage,
		});
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const isValid = REGEX.PASSWORD.test(e.target.value);
		const errorMessage = isValid ? "" : ERROR_MESSAGE.PASSWORD_WRONG;

		setPassword({
			...password,
			text: e.target.value,
			isValid: isValid,
			errorMessage: errorMessage,
		});
	};

	const handleLoginButton = async () => {
		const body = {
			email: email.text,
			password: password.text,
		};

		const errorHandle = (err: ClientError) => {
			if (err.message) {
				let message: string = err.message;
				message = message.replace("Bad Request: ", "");
				if (message.includes("또는")) {
					setEmail({
						...email,
						errorMessage: message,
						isValid: false,
					});
					setPassword({
						...password,
						errorMessage: message,
						isValid: false,
					});
					return;
				}

				if (message.includes("이메일")) {
					setEmail({
						...email,
						errorMessage: message,
						isValid: false,
					});
					return;
				}
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
	};

	const handleGoogleLogin = async () => {
		try {
			const url = await getOAuthLoginUrl("google");
			if (url) {
				window.location.href = url;
			}
		} catch (error) {
			console.error("Google 로그인 에러", error);
			alert("Google 로그인 실패");
			navigate("/");
		}
	};

	const handleKakaoLogin = async () => {
		try {
			const url = await getOAuthLoginUrl("kakao");
			if (url) {
				window.location.href = url;
			}
		} catch (error) {
			console.error("kakao 로그인 에러", error);
			alert("kakao 로그인 실패");
			navigate("/");
		}
	};

	const handleNaverLogin = async () => {
		try {
			const url = await getOAuthLoginUrl("naver");
			if (url) {
				window.location.href = url;
			}
		} catch (error) {
			console.error("naver 로그인 에러", error);
			alert("naver 로그인 실패");
			navigate("/");
		}
	};

	return (
		<div className={loginContainer}>
			<h1>로그인</h1>
			<div>
				<EmailForm
					email={email.text}
					onChange={handleEmailChange}
					isValid={email.isValid}
					errorMessage={email.errorMessage}
				/>
				<PasswordForm
					password={password.text}
					onChange={handlePasswordChange}
					labelText="비밀번호"
					isValid={password.isValid}
					errorMessage={password.errorMessage}
				/>
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
