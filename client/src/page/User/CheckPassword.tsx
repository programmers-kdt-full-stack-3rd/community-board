import { FC, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { sendPOSTCheckPasswordRequest } from "../../api/users/crud";
import PasswordForm from "../../component/User/PasswordForm";
import SubmitButton from "../../component/User/SubmitButton";
import { checkPasswordWrapper } from "./CheckPassword.css";
import { REGEX } from "./constants/constants";

const CheckPassword: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState("");

  const searchParams = new URLSearchParams(location.search);
  const next = searchParams.get("next");
  const final = searchParams.get("final");

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async () => {
    if (!password) {
      alert("비밀번호를 입력하세요.");
      return;
    }
    if (REGEX.PASSWORD.test(password) === false) {
      alert("비밀번호가 일치하지 않습니다.");
      setPassword("");
      return;
    }

    const result = await sendPOSTCheckPasswordRequest({ password });
    if (result.status === 400) {
      alert("비밀번호가 일치하지 않습니다.");
      setPassword("");
      return;
    }

    if (result.status === 401) {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }

    navigate(`/${next}?final=${final}`);
  };
  return (
    <>
      <div className={checkPasswordWrapper}>
        <PasswordForm
          labelText="비밀번호 재확인"
          password={password}
          onChange={handlePasswordChange}
        />
        <SubmitButton onClick={handleSubmit}>확인</SubmitButton>
      </div>
    </>
  );
};

export default CheckPassword;
