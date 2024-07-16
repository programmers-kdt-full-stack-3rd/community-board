import { FiLogIn, FiLogOut, FiUser, FiUserPlus } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { sendPostLogoutRequest } from "../../api/users/crud";
import { useUserStore } from "../../state/store";
import { RiAliensFill } from "react-icons/ri";
import {
  button,
  header,
  iconButtonGroup,
  nicknameInfo,
  siteTitle,
  userAuthPanel,
} from "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const isLogin = useUserStore.use.isLogin();
  const nickname = useUserStore.use.nickname();
  const { setLogoutUser } = useUserStore.use.actions();

  const handleLogin = () => {
    const currentPath = window.location.pathname;
    navigate(`/login?redirect=${currentPath}`);
  };

  const handleLogout = async () => {
    const result = await sendPostLogoutRequest();
    if (result.status !== 200) {
      alert("로그아웃에 실패했습니다.");
      console.log(result);
      return;
    }
    setLogoutUser();
  };

  const handleUserInfo = () => {
    //TODO: 유저 정보 화면 생성후 추가
    console.log("유저정보");
  };

  const handleJoin = () => {
    navigate("/join");
  };

  return (
    <div className={header}>
      <Link to="/" className={siteTitle}>
        <RiAliensFill />
        DBDB DEEP
      </Link>
      <div className={userAuthPanel}>
        {isLogin && (
          <div className={nicknameInfo}>{nickname}님 환영 합니다.</div>
        )}
        <div className={iconButtonGroup}>
          <div
            className={button}
            onClick={isLogin ? handleLogout : handleLogin}
          >
            {isLogin ? (
              <FiLogOut size="30" title="로그아웃" />
            ) : (
              <FiLogIn size="30" title="로그인" />
            )}
          </div>
          <div
            onClick={isLogin ? handleUserInfo : handleJoin}
            className={button}
          >
            {isLogin ? (
              <FiUser size="30" title="유저정보" />
            ) : (
              <FiUserPlus size="30" title="회원가입" />
            )}
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default Header;
