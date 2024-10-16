import { ChangeEvent, FC, useMemo, useState } from "react";
import PasswordForm from "../../component/User/PasswordForm";
import SubmitButton from "../../component/User/SubmitButton";
import { ERROR_MESSAGE, REGEX } from "./constants/constants";
import ErrorMessageForm from "../../component/User/ErrorMessageForm";
import { sendPutUpdateUserRequest } from "../../api/users/crud";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "../../state/store";
import { ApiCall } from "../../api/api";
import { ClientError } from "../../api/errors";
import EmailForm from "../../component/User/EmailForm";
import { useStringWithValidation } from "../../hook/useStringWithValidation";
import { useGlobalErrorModal } from "../../state/GlobalErrorModalStore";

const EmailRegistration: FC = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const searchParams = new URLSearchParams(location.search);
	const final = searchParams.get("final");

	const email = useStringWithValidation();
	const password = useStringWithValidation();
	const requiredPassword = useStringWithValidation();
	const [errorMessage, setErrorMessage] = useState("");

	const globalErrorModal = useGlobalErrorModal();

	const { setIsEmailRegistered } = useUserStore.use.actions();

	const storeNickName = useUserStore.use.nickname();
	const isEmailRegistered = useUserStore.use.isEmailRegistered();

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
			globalErrorModal.open({
				title: "오류",
				message: "로그인이 필요합니다.",
			});
			navigate("/login");
			return;
		}

		if (err.code !== 200) {
			globalErrorModal.open({
				title: "오류",
				message: "로그인 정보가 만료되었거나 유효하지 않습니다.",
			});
			navigate(`/checkPassword?next=emailRegistration&final=${final}`);
			return;
		}
	};

	const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
		email.setValue(e.target.value);
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
		() => email.isValid && password.isValid && requiredPassword.isValid,
		[email.isValid, password.isValid, requiredPassword.isValid]
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

	const handleSubmit = async () => {
		if (isEmailRegistered) {
			globalErrorModal.open({
				title: "오류",
				message: `${storeNickName} 님은 이미 이메일을 등록했습니다.`,
			});
			navigate(final || "/");
			return;
		}

		// TODO: 백엔드에서 API 분리 필요 (이메일 등록 API)
		const result = await ApiCall(
			() =>
				sendPutUpdateUserRequest({
					email: email.value,
					nickname: storeNickName,
					password: password.value,
				}),
			handleError
		);

		if (result instanceof ClientError) {
			return;
		}

		setIsEmailRegistered(true);
		navigate(final || "/");

		globalErrorModal.open({
			variant: "info",
			title: "이메일 등록 성공",
			message: "로그인 이메일을 등록했습니다.",
		});
	};

	const handleCancle = () => {
		navigate(final || "/");
	};

	return (
		<div className="mx-auto w-full max-w-[350px] rounded-lg bg-gray-800 p-5 shadow-md">
			<h1>로그인 이메일 등록</h1>

			<div className="flex flex-col gap-2.5">
				<EmailForm
					email={email.value}
					onChange={handleEmailChange}
					errorMessage={email.errorMessage}
					isValid={email.isValid}
					isDuplicateCheck={true}
					duplicationCheckFunc={checkEmailDuplication}
				/>
				<PasswordForm
					labelText={"등록할 비밀번호"}
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

				<div className="flex w-full flex-row justify-between gap-2.5">
					<button
						className="my-3 h-[50px] w-full cursor-pointer rounded-md bg-gray-600 p-0 text-white hover:brightness-75"
						onClick={handleCancle}
					>
						취소
					</button>
					<SubmitButton
						className={
							btnApply
								? `my-4 h-[50px] w-full cursor-pointer rounded-[6px] border border-[#444] bg-green-600 p-0 text-center text-base text-white transition-opacity duration-200 hover:bg-[#666] hover:opacity-90`
								: `my-4 h-[50px] w-full cursor-pointer rounded-[6px] border border-[#444] bg-[#555] p-0 text-center text-base text-white transition-opacity duration-200 hover:bg-[#666] hover:opacity-90`
						}
						onClick={handleSubmit}
						apply={btnApply}
					>
						이메일 등록
					</SubmitButton>
				</div>
			</div>
		</div>
	);
};

export default EmailRegistration;
