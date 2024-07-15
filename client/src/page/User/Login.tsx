import { FC, useEffect, useState } from "react";
import { joinLink, loginWrapper } from "./Login.css";
import { sendPostLoginRequest } from "../../api/users/crud";
import { useNavigate } from "react-router-dom";
import EmailForm from "../../component/User/EmailForm";
import PasswordForm from "../../component/User/PasswordForm";
import ErrorMessageForm from "../../component/User/ErrorMessageForm";
import { useUserStore } from "../../state/store";
import { REGEX } from "./constants/constants";
import SubmitButton from "../../component/User/SubmitButton";

interface ILogin {
  message: string;
  result?: {
    nickname: string;
    loginTime: string;
    isLogin: boolean;
  };
  status: number;
}

const Login: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { setLoginUser } = useUserStore.use.actions();

  // zustand 테스트용
  // const stateNickName = useUserStore.use.nickname();
  // const stateLoginTime = useUserStore.use.loginTime();
  // const stateIsLogin = useUserStore.use.isLogin();

  const navigate = useNavigate();
  // TODO: 버그 해결을 위해 제대로된 해결방법 찾아서 고치기
  useEffect(() => {
    useUserStore.persist.clearStorage();
  }, []);
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

    // TODO: 로그인시 유효성검사 따로 분리
    // 이메일 정규표현식
    const emailRegex = REGEX.EMAIL;
    //비밀번호 정규표현식(영대소문자 각각 1개 이상, 숫자 1개이상, 10자리 이상)
    const passwordRegex = REGEX.PASSWORD;

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

    const result: ILogin = await sendPostLoginRequest(body);
    if (result.status === 200 && result.result) {
      // 로그인 성공
      console.log("로그인 성공");
      const { nickname, loginTime } = result.result;

      setLoginUser(nickname, loginTime);

      //TODO: 로그인 헤더 추가 후 로그인 버튼 누른 시점의 페이지로 이동
      navigate("/user"); // 유저 페이지로 이동
    } else {
      if (result.message) {
        let message: string = result.message;
        message = message.replace("Bad Request: ", "");
        setErrorMessage(message);
      }
    }
  };

  return (
    <div className={loginWrapper}>
      <h1>로그인</h1>
      <EmailForm email={email} onChange={handleEmailChange} />
      <PasswordForm
        password={password}
        onChange={handlePasswordChange}
        labelText="비밀번호"
      />
      {errorMessage && <ErrorMessageForm>{errorMessage}</ErrorMessageForm>}
      <SubmitButton onClick={handleLoginButton}>로그인 버튼</SubmitButton>
      <div className={joinLink} onClick={() => navigate("/join")}>
        회원가입
      </div>

      {
        // zustand 테스트용
        /* <div>
        <p>zustand 테스트</p>
        <p>nickName: {stateNickName}</p>
        <p>loginTime: {stateLoginTime}</p>
        <p>isLogin: {stateIsLogin ? "로그인됨" : "로그아웃됨"}</p>
      </div> */
      }
    </div>
  );
};

export default Login;
