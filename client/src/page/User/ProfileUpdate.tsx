import { ChangeEvent, FC, useState } from "react";
import NicknameForm from "../../component/User/NicknameForm";
import PasswordForm from "../../component/User/PasswordForm";
import {
	buttonsWrapper,
	cancleButton,
	profileUpdateWrapper,
} from "./ProfileUpdate.css";
import SubmitButton from "../../component/User/SubmitButton";
import { REGEX } from "./constants/constants";
import ErrorMessageForm from "../../component/User/ErrorMessageForm";
import { sendPutUpdateUserRequest } from "../../api/users/crud";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "../../state/store";
import { ApiCall } from "../../api/api";
import { ClientError } from "../../api/errors";

interface IProfileUpdateResult {
	status: number;
	message: string;
}

const ProfileUpdate: FC = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const searchParams = new URLSearchParams(location.search);
	const final = searchParams.get("final");

	const [nickname, setNickname] = useState("");
	const [password, setPassword] = useState("");
	const [requiredPassword, setRequiredPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const { setNickName: storeSetNickName } = useUserStore.use.actions();

	const storeNickName = useUserStore.use.nickname();

	const validateProfileUpdate = (
		nickname: string,
		password: string,
		requiredPassword: string
	): boolean => {
		if (!nickname) {
			setErrorMessage("닉네임을 입력하세요.");
			return false;
		}

		if (nickname === storeNickName) {
			setErrorMessage("기존 닉네임과 동일합니다.");
			return false;
		}

		if (!password) {
			setErrorMessage("비밀번호를 입력하세요.");
			return false;
		}
		if (!requiredPassword) {
			setErrorMessage("비밀번호가 서로 다릅니다.");
			return false;
		}
		if (password !== requiredPassword) {
			setErrorMessage("비밀번호가 일치하지 않습니다.");
			return false;
		}

		if (REGEX.PASSWORD.test(password) === false) {
			setErrorMessage(
				"비밀번호: 10자 이상의 영문 대/소문자, 숫자를 사용해 주세요."
			);
			return false;
		}
		return true;
	};

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
			alert("로그인이 필요합니다.");
			navigate("/login");
			return;
		}

		if (err.code !== 200) {
			alert("검증되지 않은 유저 입니다.");
			navigate(`/checkPassword?next=profileUpdate&final=${final}`);
			return;
		}
	};

	const handleNicknameChange = (e: ChangeEvent<HTMLInputElement>) => {
		setNickname(e.target.value);
	};

	const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};

	const handleRequiredPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
		setRequiredPassword(e.target.value);
	};

	const handleSubmit = async () => {
		if (!validateProfileUpdate(nickname, password, requiredPassword)) {
			return;
		}

		const result: IProfileUpdateResult = await ApiCall(
			() =>
				sendPutUpdateUserRequest({
					nickname,
					password,
				}),
			handleError
		);

		if (result instanceof ClientError) {
			return;
		}

		navigate(final || "/");

		storeSetNickName(nickname);

		alert("유저 정보가 변경되었습니다.");
	};

	const handleCancle = () => {
		navigate(final || "/");
	};
	return (
		<div className={profileUpdateWrapper}>
			<h1>유저 정보 수정</h1>
			<NicknameForm
				labelText="변경할 닉네임"
				nickname={nickname}
				onChange={handleNicknameChange}
			/>
			<PasswordForm
				labelText={"변경할 비밀번호"}
				password={password}
				onChange={handlePasswordChange}
			/>
			<PasswordForm
				labelText={"비밀번호 확인"}
				id="requiredPassword"
				password={requiredPassword}
				onChange={handleRequiredPasswordChange}
			/>
			{errorMessage && (
				<ErrorMessageForm>{errorMessage}</ErrorMessageForm>
			)}
			<div className={buttonsWrapper}>
				<button
					className={cancleButton}
					onClick={handleCancle}
				>
					취소
				</button>
				<SubmitButton onClick={handleSubmit}>
					유저 정보 변경
				</SubmitButton>
			</div>
		</div>
	);
};

export default ProfileUpdate;
