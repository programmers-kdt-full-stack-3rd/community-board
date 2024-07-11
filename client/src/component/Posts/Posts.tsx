import { sendGetTestRequest } from "../../api/test/test";

const Posts = () => {

  const getTest = () => {
    sendGetTestRequest().then((res)=>{
      console.log(res);
    });
  };

  return (
    <div>
      <button onClick={getTest}>테스트 보내기</button>
    </div>
  )
}

export default Posts