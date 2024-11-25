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
import { useStringWithValidation } from "../../hook/useStringWithValidation";
import { useGlobalErrorModal } from "../../state/GlobalErrorModalStore";
import { useToast } from "../../state/ToastStore";
import TextInput from "../../component/common/TextInput";
import Button from "../../component/common/Button";

const ProfileUpdate: FC = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const searchParams = new URLSearchParams(location.search);
	const final = searchParams.get("final");

	const nickname = useStringWithValidation();
	const password = useStringWithValidation();
	const requiredPassword = useStringWithValidation();
	const [errorMessage, setErrorMessage] = useState("");

	const globalErrorModal = useGlobalErrorModal();
	const toast = useToast();

	const { setNickName: storeSetNickName } = useUserStore.use.actions();

	const storeNickName = useUserStore.use.nickname();
	const isEmailRegistered = useUserStore.use.isEmailRegistered();

	const handleNicknameChange = (e: ChangeEvent<HTMLInputElement>) => {
		nickname.setValue(e.target.value, (value, _pass, fail) => {
			if (value === storeNickName) {
				fail("현재 닉네임과 동일합니다.");
			} else {
				fail("");
			}
		});
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
		() =>
			nickname.isValid &&
			(!isEmailRegistered ||
				(password.isValid && requiredPassword.isValid)),
		[
			isEmailRegistered,
			nickname.isValid,
			password.isValid,
			requiredPassword.isValid,
		]
	);

	const checkNicknameDuplication = () => {
		nickname.setValidation(async (value, pass, fail) => {
			if (!REGEX.NICKNAME.test(value)) {
				fail(ERROR_MESSAGE.NICKNAME_REGEX);
				return;
			}

			sendPostCheckUserRequest({ nickname: value }).then(res => {
				if (res.error !== "") {
					fail("잠시 후 다시 시도해주세요!");
					return;
				}

				if (res.isDuplicated) {
					fail("중복된 닉네임입니다.");
					return;
				}

				pass();
			});
		});
	};

	// TODO: 닉네임, 비밀번호를 따로 변경할 수 있도록 서버, 클라이언트 수정 필요.
	//       현재는 비밀번호가 없는 유저의 닉네임을 변경할 수 없음.
	const handleSubmit = async () => {
		sendPutUpdateUserRequest({
			nickname: nickname.value,
			password: password.value,
		}).then(res => {
			if (res.error !== "" && res.status >= 400) {
				if (res.status === 400) {
					let message: string = res.error;
					message = message.replace("Bad Request: ", "");
					setErrorMessage(message);
					return;
				}

				if (res.status === 401) {
					globalErrorModal.open({
						title: "오류",
						message: "로그인이 필요합니다.",
					});
					navigate("/login");
					return;
				} else {
					globalErrorModal.open({
						title: "오류",
						message:
							"로그인 정보가 만료되었거나 유효하지 않습니다.",
					});
					navigate(
						`/checkPassword?next=profileUpdate&final=${final}`
					);
					return;
				}
			}

			storeSetNickName(nickname.value);

			toast.add({
				message: "유저 정보를 변경했습니다.",
				variant: "success",
			});

			navigate(final || "/");
		});
	};

	const handleCancle = () => {
		navigate(final || "/");
	};

	return (
		<div className="dark:bg-customGray mx-auto w-full max-w-[350px] rounded-lg bg-gray-200 p-5 shadow-md">
			<h1 className="mb-5 px-3 font-bold text-gray-600 dark:text-gray-400">
				유저 정보 수정
			</h1>

			<div className="flex flex-col gap-2.5">
				<TextInput
					type="text"
					id="nickname"
					label="변경할 닉네임"
					value={nickname.value}
					placeholder="닉네임을 입력하세요."
					isValid={nickname.isValid}
					errorMessage={nickname.errorMessage}
					onChange={handleNicknameChange}
					actionButton={
						<Button
							size="small"
							disabled={nickname.isValid}
							onClick={checkNicknameDuplication}
						>
							중복 확인
						</Button>
					}
				/>

				{isEmailRegistered && (
					<>
						<PasswordForm
							mode="new"
							id="password"
							label="변경할 비밀번호"
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
					</>
				)}
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
						유저 정보 변경
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ProfileUpdate;
