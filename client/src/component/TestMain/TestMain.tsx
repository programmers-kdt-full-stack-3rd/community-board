import { useNavigate } from "react-router-dom";

const TestMain = () => {
    const navigate = useNavigate();

    return (
        <div className="main">
            <div className="card">
                <button onClick={()=>navigate("/user")}>회원 기능</button>
                <button onClick={()=>navigate("/test")}>테스트 보기</button>
                <button onClick={()=>navigate("/posts")}>게시글 기능</button>
            </div>
            <p className="read-the-docs">
                상단의 개발 할 컴포넌트 클릭
            </p>
        </div>
    );
}

export default TestMain;