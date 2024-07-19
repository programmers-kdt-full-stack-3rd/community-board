import { Dispatch, FC, SetStateAction, useState } from "react";
import EmailForm from "../../component/User/EmailForm";
import PasswordForm from "../../component/User/PasswordForm";
import SubmitButton from "../../component/User/SubmitButton";
import NicknameForm from "../../component/User/NicknameForm";
import ErrorMessageForm from "../../component/User/ErrorMessageForm";
import { REGEX } from "./constants/constants";
import { joinWrapper, passwordReqStyle } from "./Join.css";
import { sendPostJoinRequest } from "../../api/users/crud";
import { useNavigate } from "react-router-dom";

// 회원가입 유효성 검사
function validateJoin(
  email: string,
  password: string,
  requiredPassword: string,
  nickname: string,
  setErrorMessage: Dispatch<SetStateAction<string>>
): boolean {
  const emailRegex = REGEX.EMAIL;
  const passwordRegex = REGEX.PASSWORD;

  if (!email) {
    setErrorMessage("이메일을 입력하세요.");
    return false;
  }

  if (!password) {
    setErrorMessage("비밀번호를 입력하세요.");
    return false;
  }

  if (!requiredPassword) {
    setErrorMessage("비밀번호 확인을 입력하세요.");
    return false;
  }

  if (password !== requiredPassword) {
    setErrorMessage("비밀번호가 일치하지 않습니다.");
    return false;
  }

  if (!nickname) {
    setErrorMessage("닉네임을 입력하세요.");
    return false;
  }

  if (!emailRegex.test(email)) {
    setErrorMessage("이메일 형식이 올바르지 않습니다.");
    return false;
  }

  if (!passwordRegex.test(password)) {
    setErrorMessage(
      "비밀번호: 10자 이상의 영문 대/소문자, 숫자를 사용해 주세요."
    );
    return false;
  }

  setErrorMessage("");
  return true;
}

const Join: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [requiredPassword, setRequiredPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [nickname, setNickname] = useState("");

  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleRequiredPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRequiredPassword(e.target.value);
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const handleJoinButton = async () => {
    //TODO: 유효성검사 안지켰을시 style변경
    const isValid = validateJoin(
      email,
      password,
      requiredPassword,
      nickname,
      setErrorMessage
    );

    if (isValid) {
      const result = await sendPostJoinRequest({
        email,
        password,
        requiredPassword,
        nickname,
      });

      if (result.status !== 201) {
        if (result.message) {
          let message: string = result.message;
          message = message.replace("Bad Request: ", "");
          setErrorMessage(message);
        }
      } else {
        alert("회원가입이 완료되었습니다.");
        navigate("/login");
      }
    }
  };

  return (
    <div className={joinWrapper}>
      <h1>회원가입</h1>
      <EmailForm email={email} onChange={handleEmailChange} />
      {/*TODO: 비밀번호 복사 방지 기능 추가*/}
      <PasswordForm
        password={password}
        onChange={handlePasswordChange}
        labelText="비밀번호"
      />
      <div className={passwordReqStyle}>
        조건 : 10자 이상의 영문 대/소문자, 숫자를 사용
      </div>
      <PasswordForm
        password={requiredPassword}
        id={"requiredPassword"}
        onChange={handleRequiredPasswordChange}
        labelText="비밀번호 확인"
      />
      <NicknameForm
        nickname={nickname}
        onChange={handleNicknameChange}
        labelText="닉네임"
      />

      {errorMessage && <ErrorMessageForm>{errorMessage}</ErrorMessageForm>}

      <SubmitButton onClick={handleJoinButton}>회원 가입</SubmitButton>
    </div>
  );
};

export default Join;
