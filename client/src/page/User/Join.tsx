import { FC, useMemo } from "react";
import PasswordForm from "../../component/User/PasswordForm";
import { ERROR_MESSAGE, REGEX } from "./constants/constants";
import { ClientError } from "../../api/errors";
import { ApiCall } from "../../api/api";
import {
	sendPostCheckUserRequest,
	sendPostJoinRequest,
} from "../../api/users/crud";
import { useNavigate } from "react-router-dom";
import { useStringWithValidation } from "../../hook/useStringWithValidation";
import { FaComments } from "react-icons/fa6";
import { useGlobalErrorModal } from "../../state/GlobalErrorModalStore";
import TextInput from "../../component/common/TextInput";
import Button from "../../component/common/Button";
import { IJoinRequest } from "shared";

const Join: FC = () => {
	const navigate = useNavigate();
	const email = useStringWithValidation();
	const nickname = useStringWithValidation();
	const password = useStringWithValidation();
	const requiredPassword = useStringWithValidation();

	const globalErrorModal = useGlobalErrorModal();

	const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
		email.setValue(e.target.value);
	};

	const handleNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
		nickname.setValue(e.target.value);
	};

	const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
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

	const handleRequiredPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
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
			(email.isValid &&
				nickname.isValid &&
				password.isValid &&
				requiredPassword.isValid) ??
			false,
		[
			email.isValid,
			nickname.isValid,
			password.isValid,
			requiredPassword.isValid,
		]
	);

	const checkEmailDuplication = () => {
		email.setValidation(async (value, pass, fail) => {
			if (!REGEX.EMAIL.test(value)) {
				fail(ERROR_MESSAGE.EMAIL_REGEX);
				return;
			}

			sendPostCheckUserRequest({ email: value }).then(res => {
				if (res.error !== "") {
					fail("잠시 후 다시 시도해주세요!");
					return;
				}

				if (res.isDuplicated) {
					fail("중복된 이메일입니다.");
					return;
				}

				pass();
			});
		});
	};

	const checkNicknameDuplication = () => {
		nickname.setValidation(async (value, pass, fail) => {
			if (!REGEX.NICKNAME.test(value)) {
				fail(ERROR_MESSAGE.NICKNAME_REGEX);
				return;
			}

			const res = await ApiCall(
				() => sendPostCheckUserRequest({ nickname: value }),
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
				fail("중복된 닉네임입니다.");
				return;
			}

			pass();
		});
	};

	const submitJoin = async () => {
		const body: IJoinRequest = {
			email: email.value,
			nickname: nickname.value,
			password: password.value,
		};

		sendPostJoinRequest(body).then(res => {
			if (res.error !== "") {
				console.log(res.error);
				return;
			}

			globalErrorModal.open({
				variant: "info",
				title: "회원 가입 완료",
				message: "회원가입을 완료했습니다.",
			});

			navigate("/login");
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
					회원가입
				</span>
				<hr className="flex-grow text-gray-600 dark:text-gray-500" />
			</div>

			<div className="flex w-full flex-col gap-4">
				<TextInput
					type="email"
					id="email"
					label="이메일"
					value={email.value}
					placeholder="이메일을 입력하세요."
					isValid={email.isValid}
					errorMessage={email.errorMessage}
					onChange={handleEmail}
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

				<TextInput
					type="text"
					id="nickname"
					label="닉네임"
					value={nickname.value}
					placeholder="닉네임을 입력하세요."
					isValid={nickname.isValid}
					errorMessage={nickname.errorMessage}
					onChange={handleNickname}
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

				<PasswordForm
					mode="new"
					id="password"
					label="비밀번호"
					value={password.value}
					placeholder="10자 이상의 영문 대/소문자, 숫자를 사용"
					isValid={password.isValid}
					errorMessage={password.errorMessage}
					onChange={handlePassword}
				/>

				<PasswordForm
					mode="confirm"
					id="password-confirm"
					label="비밀번호 확인"
					isValid={requiredPassword.isValid}
					errorMessage={requiredPassword.errorMessage}
					onChange={handleRequiredPassword}
				/>

				<Button
					type="submit"
					className="mt-5"
					size="large"
					disabled={!btnApply}
					onClick={submitJoin}
				>
					회원가입
				</Button>
			</div>
		</div>
	);
};

export default Join;
