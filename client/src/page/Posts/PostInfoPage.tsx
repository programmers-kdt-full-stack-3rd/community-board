import { useLayoutEffect, useState } from "react";
import PostInfo from "../../component/Posts/PostInfo";
import { PostInfoPageStyle } from "./PostInfoPage.css";
import { useParams } from 'react-router-dom';
import { IPostInfo, mapDBToPostInfo } from "shared";
import { sendGetPostRequest } from "../../api/posts/crud";
import Comments from "../../component/Comments/Comments";

const PostInfoPage = () => {
  const { id } = useParams();
  const [postInfo, setPostInfo] = useState<IPostInfo>({
    id: 0,
    title: "",
    content: "",
    author_id : 0,
    author_nickname: "",
    is_author : false,
    created_at: new Date(),
    updated_at : undefined,
    views: 0,
    likes: 0,
    user_liked : false
  });

  useLayoutEffect(() => {
    if(!id) {
      {/* TODO : 에러 핸들링하기 */}
      return;
    }

    sendGetPostRequest(id).then((res)=>{
      if(res.status >= 400){
        console.log(res);
        return;
      }
      setPostInfo(mapDBToPostInfo(res.post));
    });
  }, []);

  return (
    <div className={PostInfoPageStyle}>
      <PostInfo postInfo={postInfo} />
      <Comments postId={postInfo.id || parseInt(id ?? "0", 10) || 0} />
    </div>
  );
};

export default PostInfoPage;
