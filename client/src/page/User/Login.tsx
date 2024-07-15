import { FC, useState } from "react";
import {
  input,
  inputBox,
  joinButton as joinLink,
  label,
  loginButton,
  loginForm,
  loginWrapper,
  errorMessageStyle,
} from "./Login.css";
import { sendPostLoginRequest } from "../../api/users/crud";
import { useNavigate } from "react-router-dom";

const Login: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLoginButton = async () => {
    const body = {
      email,
      password,
    };

    // 이메일 정규표현식
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/;
    //비밀번호 정규표현식(영대소문자 각각 1개 이상, 숫자 1개이상, 10자리 이상)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,}$/;

    if (!email) {
      setErrorMessage("이메일을 입력하세요.");
      return;
    }

    if (!password) {
      setErrorMessage("비밀번호를 입력하세요.");
      return;
    }

    if (!emailRegex.test(email) || !passwordRegex.test(password)) {
      setErrorMessage("이메일 또는 비밀번호가 틀렸습니다.");
      return;
    }

    const result = await sendPostLoginRequest(body);
    if (result.status !== 200) {
      if (result.message) {
        let message: string = result.message;
        message = message.replace("Bad Request: ", "");
        setErrorMessage(message);
      }
    } else {
      // 로그인 성공
      console.log("로그인 성공");

      //TODO: 로그인 헤더 추가 후 로그인 버튼 누른 시점의 페이지로 이동
      navigate("/user"); // 유저 페이지로 이동

      //TODO: 로그인 성공시 Zustand추가 후 처리 추가
    }
  };

  return (
    <div className={loginWrapper}>
      <h1>로그인</h1>
      <div className={loginForm}>
        <div className={inputBox}>
          <label className={label} htmlFor="email">
            이메일
          </label>
          <input
            className={input}
            type="email"
            id="email"
            onChange={handleEmailChange}
            value={email}
            placeholder="이메일을 입력하세요."
          />
        </div>
        <div className={inputBox}>
          <label className={label} htmlFor="password">
            비밀번호
          </label>
          <input
            className={input}
            type="password"
            id="password"
            onChange={handlePasswordChange}
            value={password}
            placeholder="비밀번호를 입력하세요."
          />
          {errorMessage && (
            <div className={errorMessageStyle}>{errorMessage}</div>
          )}
        </div>
        <button
          className={loginButton}
          onClick={handleLoginButton}
          type="submit"
        >
          로그인
        </button>
        {/* TODO: 회원가입 페이지 만든 이후 클릭시 페이지 이동 기능 추가 */}
        <div className={joinLink}>회원가입</div>
      </div>
    </div>
  );
};

export default Login;
