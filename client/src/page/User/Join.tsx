import { FC, useEffect, useState } from "react";
import EmailForm from "../../component/User/EmailForm";
import PasswordForm from "../../component/User/PasswordForm";
import SubmitButton from "../../component/User/SubmitButton";
import NicknameForm from "../../component/User/NicknameForm";
import { ERROR_MESSAGE, REGEX } from "./constants/constants";
import { joinWrapper } from "./Join.css";
import {
	applySubmitButtonStyle,
	submitButtonStyle,
} from "../../component/User/css/SubmitButton.css";
import { ClientError } from "../../api/errors";
import { ApiCall } from "../../api/api";
import { sendPostJoinRequest } from "../../api/users/crud";
import { useNavigate } from "react-router-dom";
import { useStringWithValidation } from "../../hook/useStringWithValidation";

const Join: FC = () => {
	const navigate = useNavigate();
	const email = useStringWithValidation();
	const nickname = useStringWithValidation();
	const password = useStringWithValidation();
	const requiredPassword = useStringWithValidation();

	const [btnApply, setBtnApply] = useState<boolean>(false);

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

	const handleRequiredPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
		requiredPassword.setValue(e.target.value, (value, pass, fail) => {
			if (password.value === value) {
				pass();
			} else {
				fail(ERROR_MESSAGE.PASSWORD_MISMATCH);
			}
		});
	};

	useEffect(() => {
		if (
			email.isValid &&
			nickname.isValid &&
			password.isValid &&
			requiredPassword.isValid
		) {
			setBtnApply(true);
		} else {
			setBtnApply(false);
		}
	}, [
		email.isValid,
		nickname.isValid,
		password.isValid,
		requiredPassword.isValid,
	]);

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

	const checkNicknameDuplication = () => {
		nickname.setValidation((value, pass, fail) => {
			if (!REGEX.NICKNAME.test(value)) {
				fail(ERROR_MESSAGE.NICKNAME_REGEX);
				return;
			}

			// TODO : api 호출해서 중복 확인

			pass();
		});
	};

	const submitJoin = async () => {
		const body = {
			email: email.value,
			nickname: nickname.value,
			password: password.value,
			requiredPassword: requiredPassword.value,
		};

		const errorHandle = (err: ClientError) => {
			if (err.code === 400) {
				if (err.message) {
					let message: string = err.message;
					message = message.replace("Bad Request: ", "");
					console.log(message);
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
	};

	return (
		<div className={joinWrapper}>
			<h1>회원가입</h1>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "10px",
				}}
			>
				<EmailForm
					email={email.value}
					onChange={handleEmail}
					duplicationCheckFunc={checkEmailDuplication}
					errorMessage={email.errorMessage}
					isValid={email.isValid}
					isDuplicateCheck={true}
				/>
				<NicknameForm
					nickname={nickname.value}
					labelText="닉네임"
					onChange={handleNickname}
					duplicationCheckFunc={checkNicknameDuplication}
					errorMessage={nickname.errorMessage}
					isValid={nickname.isValid}
					isDuplicateCheck={true}
				/>
				<PasswordForm
					password={password.value}
					onChange={handlePassword}
					labelText="비밀번호"
					placeholder="10자 이상의 영문 대/소문자, 숫자를 사용"
					errorMessage={password.errorMessage}
					isValid={password.isValid}
				/>
				<PasswordForm
					password={requiredPassword.value}
					id={"requiredPassword"}
					onChange={handleRequiredPassword}
					labelText="비밀번호 확인"
					errorMessage={requiredPassword.errorMessage}
					isValid={requiredPassword.isValid}
				/>

				<SubmitButton
					className={
						btnApply ? applySubmitButtonStyle : submitButtonStyle
					}
					onClick={submitJoin}
					apply={btnApply}
				>
					회원 가입
				</SubmitButton>
			</div>
		</div>
	);
};

export default Join;
