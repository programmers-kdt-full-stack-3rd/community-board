import { SortBy } from "shared";
import { sendGetPostRequest, sendGetPostsRequest } from "../../api/posts/crud";
import { useState } from "react";
import PostModal from "./Modal/PostModal";

const Posts = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openUpdateModal, setOpenUpdateModal] = useState<boolean>(false);


  const getPosts = () => {
    const query = `?index=1&perPage=5&sortBy=`+SortBy.LIKES;
    sendGetPostsRequest(query).then((res)=>{
      console.log(res);
    });
  };

  const getPost = () => {
    const post_id = '1';
    sendGetPostRequest(post_id).then((res)=>{
      console.log(res);
    });
  };

  const testPostData = {
    id : 1,
    title : "히히",
    content : "길낄"
  }

  return (
    <div>
      {openModal ? <PostModal close={setOpenModal}/> : null}
      {openUpdateModal ? <PostModal close={setOpenUpdateModal} originalPostData={testPostData}/> : null}
      <button onClick={()=>setOpenModal(true)}>생성 모달 띄우기</button>
      <button onClick={()=>setOpenUpdateModal(true)}>수정 모달 띄우기</button>
      <button onClick={getPosts}>게시글 목록 불러오기</button>
      <button onClick={getPost}>게시글 내용 보기</button>
    </div>
  )
}

export default Posts