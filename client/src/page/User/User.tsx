import { useNavigate } from "react-router-dom";

const User = () => {
  const navigate = useNavigate();
  return (
    <div>
      <button onClick={() => navigate("/login")}>로그인 화면</button>
      <button onClick={() => navigate("/join")}>회원가입 화면</button>
      <button onClick={() => navigate("/checkPassword")}>
        비밀번호 확인 화면
      </button>
      <button onClick={() => navigate("/profileUpdate")}>
        회원정보 수정 화면
      </button>
    </div>
  );
};

export default User;
