import { SetStateAction } from "react";
import { sendDeletePostRequest } from "../../../api/posts/crud";
import { useNavigate } from "react-router-dom";
import { Btns, CancleBtn, DeleteBtn, DeleteModalContainer, DeleteModalText } from "./DeleteModal.css";

interface IDeleteModalProps {
  close : React.Dispatch<SetStateAction<boolean>>;
  postId : number;
  isAuthor : boolean;
}

const DeleteModal : React.FC<IDeleteModalProps> = ({ close, postId, isAuthor }) => {
  const navigate = useNavigate();

  const handlePostDelete = () => {
    // TODO : 메모제이션으로 최적화
    if(!isAuthor){
      alert("삭제 권한이 없습니다.");
    }

    sendDeletePostRequest(postId.toString()).then((res)=>{
      if(res.status >= 400){
        console.log(res);
        return;
      }
      close(false);
      alert("삭제에 성공했습니다.");
      navigate("/");
    });
  };

  return (
    <div className={DeleteModalContainer}>
      <div className={DeleteModalText}>정말 게시글을 삭제하겠습니까?</div>
      <div className={Btns}>
        <button className={DeleteBtn} onClick={()=>handlePostDelete()}>삭제</button>
        <button className={CancleBtn} onClick={()=>close(false)}>취소</button>
      </div>
    </div>
  )
};

export default DeleteModal;