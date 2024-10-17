import { ChangeEvent, FC, useMemo, useState } from "react";
import PasswordForm from "../../component/User/PasswordForm";
import { ERROR_MESSAGE, REGEX } from "./constants/constants";
import ErrorMessageForm from "../../component/User/ErrorMessageForm";
import {
	sendPostCheckUserRequest,
	sendPutUpdateUserRequest,
} from "../../api/users/crud";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "../../state/store";
import { ApiCall } from "../../api/api";
import { ClientError } from "../../api/errors";
import { useStringWithValidation } from "../../hook/useStringWithValidation";
import { useGlobalErrorModal } from "../../state/GlobalErrorModalStore";
import TextInput from "../../component/common/TextInput";
import Button from "../../component/common/Button";

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

		requiredPassword.setValidation((value, pass, fail, clear) => {
			if (!value) {
				clear();
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
		() =>
			(email.isValid && password.isValid && requiredPassword.isValid) ??
			false,
		[email.isValid, password.isValid, requiredPassword.isValid]
	);

	const checkEmailDuplication = () => {
		email.setValidation((value, pass, fail) => {
			if (!REGEX.EMAIL.test(value)) {
				fail(ERROR_MESSAGE.EMAIL_REGEX);
				return;
			}

			email.setValidation(async (value, pass, fail) => {
				if (!REGEX.EMAIL.test(value)) {
					fail(ERROR_MESSAGE.EMAIL_REGEX);
					return;
				}

				const res = await ApiCall(
					() => sendPostCheckUserRequest({ email: value }),
					err => {
						console.log(err);
						fail("잠시 후 다시 시도해주세요!");
						return;
					}
				);

				if (res instanceof ClientError) {
					return;
				}

				if (res.isDuplicated) {
					fail("중복된 이메일입니다.");
					return;
				}

				pass();
			});

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
		<div className="dark:bg-customGray mx-auto w-full max-w-[350px] rounded-lg bg-gray-200 p-5 shadow-md">
			<h1 className="mb-5 px-3 font-bold text-gray-600 dark:text-gray-400">
				로그인 이메일 등록
			</h1>

			<div className="flex flex-col gap-2.5">
				<TextInput
					type="email"
					id="email"
					label="등록할 이메일"
					value={email.value}
					placeholder="이메일을 입력하세요."
					isValid={email.isValid}
					errorMessage={email.errorMessage}
					onChange={handleEmailChange}
					actionButton={
						<Button
							size="small"
							disabled={email.isValid}
							onClick={checkEmailDuplication}
						>
							중복 확인
						</Button>
					}
				/>

				<PasswordForm
					mode="new"
					id="password"
					label="등록할 비밀번호"
					value={password.value}
					placeholder="10자 이상의 영문 대/소문자, 숫자를 사용"
					isValid={password.isValid}
					errorMessage={password.errorMessage}
					onChange={handlePasswordChange}
				/>

				<PasswordForm
					mode="confirm"
					id="password-confirm"
					label="비밀번호 확인"
					isValid={requiredPassword.isValid}
					errorMessage={requiredPassword.errorMessage}
					onChange={handleRequiredPasswordChange}
				/>

				{errorMessage && (
					<ErrorMessageForm>{errorMessage}</ErrorMessageForm>
				)}

				<div className="mt-5 flex w-full flex-row justify-stretch gap-5">
					<Button
						className="flex-1"
						variant="text"
						size="large"
						onClick={handleCancle}
					>
						취소
					</Button>

					<Button
						className="flex-1"
						size="large"
						onClick={handleSubmit}
						disabled={!btnApply}
					>
						이메일 등록
					</Button>
				</div>
			</div>
		</div>
	);
};

export default EmailRegistration;
