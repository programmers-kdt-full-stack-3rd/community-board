import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginContainer, joinLink } from "../../page/User/Login.css";
import { REGEX } from "./constants/constants";
import EmailForm from "../../component/User/EmailForm";
import PasswordForm from "../../component/User/PasswordForm";
import SubmitButton from "../../component/User/SubmitButton";
import { useUserStore } from "../../state/store";
import { ApiCall } from "../../api/api";
import { ClientError } from "../../api/errors";
import { sendPostLoginRequest } from "../../api/users/crud";
import ErrorMessageForm from "../../component/User/ErrorMessageForm";
import OAuthLoginButtons from "../../component/User/OAuthLoginButtons";
import { useStringWithValidation } from "../../hook/useStringWithValidation";

const Login: React.FC = () => {
	const email = useStringWithValidation();
	const password = useStringWithValidation();

	const [errorMessage, setErrorMessage] = useState<string>("");

	const { setLoginUser } = useUserStore.use.actions();

	// zustand 테스트용
	// const stateNickName = useUserStore.use.nickname();
	// const stateLoginTime = useUserStore.use.loginTime();
	// const stateIsLogin = useUserStore.use.isLogin();

	const navigate = useNavigate();
	const location = useLocation();

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setErrorMessage("");

		email.setValue(e.target.value, (value, pass, fail) => {
			if (REGEX.EMAIL.test(value)) {
				pass();
			} else {
				fail("");
			}
		});
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setErrorMessage("");

		password.setValue(e.target.value, (value, pass, fail) => {
			if (REGEX.PASSWORD.test(value)) {
				pass();
			} else {
				fail("");
			}
		});
	};

	const handleLoginButton = async () => {
		const body = {
			email: email.value,
			password: password.value,
		};

		const errorHandle = (err: ClientError) => {
			if (err.message) {
				let message: string = err.message;
				message = message.replace("Bad Request: ", "");
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
	};

	return (
		<div className={loginContainer}>
			<h1>로그인</h1>
			<div>
				<EmailForm
					email={email.value}
					onChange={handleEmailChange}
					isValid={email.isValid}
					errorMessage={email.errorMessage}
				/>
				<PasswordForm
					password={password.value}
					onChange={handlePasswordChange}
					labelText="비밀번호"
					isValid={password.isValid}
					errorMessage={password.errorMessage}
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

			<OAuthLoginButtons loginType="login" />
		</div>
	);
};

export default Login;
