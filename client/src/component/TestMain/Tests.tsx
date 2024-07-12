import { sendGetTestRequest, sendPostTestRequest } from "../../api/test/test";

const Tests = () => {

  const getTest = () => {
    sendGetTestRequest().then((res)=>{
      console.log(res);
    });
  };

  const postTest = () => {
    const body = {
      user_id : "테스트계정1",
      title : "게시글입니다요"
    }
    sendPostTestRequest(body).then((res)=>{
      console.log(res);
    });
  };

  return (
    <div>
      <button onClick={getTest}>테스트(GET) 보내기</button>
      <button onClick={postTest}>테스트(POST) 보내기</button>
    </div>
  )
}

export default Tests