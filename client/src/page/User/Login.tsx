import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { REGEX } from "./constants/constants";
import EmailForm from "../../component/User/EmailForm";
import PasswordForm from "../../component/User/PasswordForm";
import SubmitButton from "../../component/User/SubmitButton";
import { useUserStore } from "../../state/store";
import { ApiCall } from "../../api/api";
import { ClientError } from "../../api/errors";
import { sendPostLoginRequest } from "../../api/users/crud";
import OAuthLoginButtons from "../../component/User/OAuthLoginButtons";
import { useStringWithValidation } from "../../hook/useStringWithValidation";
import { FaComments } from "react-icons/fa6";
import ErrorMessageForm from "../../component/User/ErrorMessageForm";

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

		// TODO: isEmailRegistered를 로그인 시 받아서 저장하도록 수정 필요.
		//       수정 후 DropdownMenu 컴포넌트의 유저 정보 조회 API 호출 제거.
		if (result.result) {
			const { nickname, email, imgUrl, loginTime } = result.result;

			setLoginUser(nickname, loginTime, email, imgUrl);

			const redirect =
				new URLSearchParams(location.search).get("redirect") || "/";
			navigate(redirect);
		}
	};

	return (
		<div className="mx-auto flex w-1/3 max-w-md flex-col items-center justify-center">
			<div className="mb-4 flex flex-row items-center gap-2 text-4xl font-bold text-blue-900 dark:text-white">
				<FaComments />
				<span>CODEPLAY</span>
			</div>
			<div className="my-4 flex w-full items-center">
				<hr className="flex-grow text-gray-600 dark:text-gray-500" />
				<span className="px-3 font-bold text-gray-600 dark:text-gray-400">
					로그인
				</span>
				<hr className="flex-grow text-gray-600 dark:text-gray-500" />
			</div>
			<div className="flex w-full flex-col gap-2">
				{/* 미리 정의된 컴포넌트로 수정 아직 안 함*/}
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
				<SubmitButton onClick={handleLoginButton}>로그인</SubmitButton>

				<div className="mt-5 flex flex-row items-center justify-center gap-2">
					<p>계정이 없으신가요?</p>
					<a
						href="/join"
						className="text-blue-500"
					>
						계정생성
					</a>
				</div>
			</div>
			<OAuthLoginButtons loginType="login" />
		</div>
	);
};

export default Login;
