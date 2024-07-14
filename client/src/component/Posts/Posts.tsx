import { SortBy } from "shared";
import { sendGetPostRequest, sendGetPostsRequest } from "../../api/posts/crud";
import { useState } from "react";
import PostModal from "./Modal/PostModal";

const Posts = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);

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

  return (
    <div>
      {openModal ? <PostModal close={setOpenModal}/> : null}
      <button onClick={()=>setOpenModal(true)}>모달 띄우기</button>
      <button onClick={getPosts}>게시글 목록 불러오기</button>
      <button onClick={getPost}>게시글 내용 보기</button>
    </div>
  )
}

export default Posts