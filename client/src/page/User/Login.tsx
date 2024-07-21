import { FC, useState } from "react";
import { joinLink, loginWrapper } from "./Login.css";
import { sendPostLoginRequest } from "../../api/users/crud";
import { useLocation, useNavigate } from "react-router-dom";
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

interface ValidationResult {
  isValid: boolean;
  errorMessage: string;
  invalidFields: ("email" | "password")[];
}

const createError = (
  message: string,
  fields: ("email" | "password")[]
): ValidationResult => ({
  isValid: false,
  errorMessage: message,
  invalidFields: fields,
});

const validateLogin = (email: string, password: string): ValidationResult => {
  const emailRegex = REGEX.EMAIL;
  const passwordRegex = REGEX.PASSWORD;

  if (!email) {
    return createError("이메일을 입력하세요.", ["email"]);
  }

  if (!password) {
    return createError("비밀번호를 입력하세요.", ["password"]);
  }

  if (!emailRegex.test(email) || !passwordRegex.test(password)) {
    return createError("이메일 또는 비밀번호가 틀렸습니다.", [
      "email",
      "password",
    ]);
  }

  return {
    isValid: true,
    errorMessage: "",
    invalidFields: [],
  };
};

const Login: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [invalidFields, setInvalidFields] = useState<("email" | "password")[]>(
    []
  );

  const { setLoginUser } = useUserStore.use.actions();

  // zustand 테스트용
  // const stateNickName = useUserStore.use.nickname();
  // const stateLoginTime = useUserStore.use.loginTime();
  // const stateIsLogin = useUserStore.use.isLogin();

  const navigate = useNavigate();
  const location = useLocation();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLoginButton = async () => {
    const validateResult = validateLogin(email, password);

    setErrorMessage(validateResult.errorMessage);
    setInvalidFields(validateResult.invalidFields);

    if (validateResult.isValid) {
      const body = {
        email,
        password,
      };
      const result: ILogin = await sendPostLoginRequest(body);
      if (result.status === 200 && result.result) {
        // 로그인 성공
        console.log("로그인 성공");
        const { nickname, loginTime } = result.result;

        setLoginUser(nickname, loginTime);

        const redirect =
          new URLSearchParams(location.search).get("redirect") || "/";
        navigate(redirect); // 이전 페이지로
      } else {
        if (result.message) {
          let message: string = result.message;
          message = message.replace("Bad Request: ", "");
          if (message.includes("또는")) {
            setInvalidFields(["email", "password"]);
            return;
          }

          if (message.includes("이메일")) {
            setInvalidFields(["email"]);
            return;
          }

          setErrorMessage(message);
        }
      }
    }
  };

  return (
    <div className={loginWrapper}>
      <h1>로그인</h1>
      <EmailForm
        email={email}
        onChange={handleEmailChange}
        isValid={!invalidFields.includes("email")}
      />
      <PasswordForm
        password={password}
        onChange={handlePasswordChange}
        labelText="비밀번호"
        isValid={!invalidFields.includes("password")}
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
