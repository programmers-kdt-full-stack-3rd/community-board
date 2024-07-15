import { useNavigate } from "react-router-dom";

const User = () => {
  const navigate = useNavigate();
  return (
    <div>
      <button onClick={() => navigate("/login")}>로그인 화면</button>
    </div>
  );
};

export default User;
