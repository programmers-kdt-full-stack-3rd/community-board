import React, { FormEvent, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { REGEX } from "./constants/constants";
import { useUserStore } from "../../state/store";
import { useToast } from "../../state/ToastStore";
import { sendPostLoginRequest } from "../../api/users/crud";
import OAuthLoginButtons from "../../component/User/OAuthLoginButtons";
import { useStringWithValidation } from "../../hook/useStringWithValidation";
import { FaComments } from "react-icons/fa6";
import ErrorMessageForm from "../../component/User/ErrorMessageForm";
import TextInput from "../../component/common/TextInput";
import Button from "../../component/common/Button";

const Login: React.FC = () => {
	const email = useStringWithValidation();
	const password = useStringWithValidation();

	const [errorMessage, setErrorMessage] = useState<string>("");

	const { setLoginUser } = useUserStore.use.actions();
	const toast = useToast();

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

	const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const body = {
			email: email.value,
			password: password.value,
		};

		sendPostLoginRequest(body).then(res => {
			if (res.error !== "") {
				setErrorMessage(res.error);
				return;
			}

			setLoginUser(res.userInfo);

			toast.add({
				message: `${res.userInfo.nickname}님 환영합니다!`,
				variant: "success",
			});

			const redirect =
				new URLSearchParams(location.search).get("redirect") || "/";

			navigate(redirect);
		});
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

			<form
				className="flex w-full flex-col gap-2"
				onSubmit={handleLogin}
			>
				<TextInput
					type="email"
					id="email"
					label="이메일"
					value={email.value}
					placeholder="이메일을 입력하세요."
					isValid={email.isValid}
					onChange={handleEmailChange}
				/>
				<TextInput
					type="password"
					id="password"
					label="비밀번호"
					value={password.value}
					placeholder="비밀번호를 입력하세요."
					isValid={password.isValid}
					onChange={handlePasswordChange}
				/>
				{errorMessage && (
					<ErrorMessageForm>{errorMessage}</ErrorMessageForm>
				)}
				<Button
					type="submit"
					className="mt-5"
					size="large"
				>
					로그인
				</Button>

				<div className="mt-5 flex flex-row items-center justify-center gap-2">
					<p>계정이 없으신가요?</p>
					<a
						href="/join"
						className="text-blue-500"
					>
						회원가입
					</a>
				</div>
			</form>

			<OAuthLoginButtons loginType="login" />
		</div>
	);
};

export default Login;
