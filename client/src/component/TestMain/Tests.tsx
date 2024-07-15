import { sendGetTestRequest, sendPostTestRequest } from "../../api/test/test";
import { useUserStore } from "../../state/store";

const Tests = () => {
  const getTest = () => {
    sendGetTestRequest().then((res) => {
      console.log(res);
    });
  };

  const postTest = () => {
    const body = {
      user_id: "테스트계정1",
      title: "게시글입니다요",
    };
    sendPostTestRequest(body).then((res) => {
      console.log(res);
    });
  };

  // zustand 사용 예시

  //액션 함수 호출 방법 (useUserStore.use.actions().액션함수명())
  const { setNickName, setLoginTime, setIsLogin } = useUserStore.use.actions();

  //상태값 호출 방법 (useUserStore.use.상태값명())
  const nickName = useUserStore.use.nickname();
  const loginTime = useUserStore.use.loginTime();
  const isLogin = useUserStore.use.isLogin();

  const handleClickZustandTest = () => {
    setNickName("테스트계정1");
    setLoginTime(new Date().toLocaleString());
    setIsLogin(!isLogin);
  };

  return (
    <div>
      <div>
        <button onClick={getTest}>테스트(GET) 보내기</button>
        <button onClick={postTest}>테스트(POST) 보내기</button>
      </div>
      <div>
        <p>zustand 테스트</p>
        <p>nickName: {nickName}</p>
        <p>loginTime: {loginTime}</p>
        <p>isLogin: {isLogin ? "로그인됨" : "로그아웃됨"}</p>
        <button onClick={handleClickZustandTest}>Zustand 테스트 버튼</button>
      </div>
    </div>
  );
};

export default Tests;
