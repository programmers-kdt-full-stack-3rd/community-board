import { EtcInfo, EtcInfoItem, FullButtons, OneButton, PostBody, PostHeader, Title, AuthorBtn, LikeBtn, LikedColor, UnLikedColor } from "./PostInfo.css";
import { dateToStr } from "../../utils/date-to-str";
import { IPostInfo } from "shared";
import { useLayoutEffect, useState } from "react";
import PostModal from "./Modal/PostModal";
import DeleteModal from "./Modal/DeleteModal";
import { AiFillLike } from "react-icons/ai";
import { sendCreatePostLikeRequest, sendDeletePostLikeRequest } from "../../api/likes/crud";

interface IPostInfoProps {
  postInfo : IPostInfo
}

const PostInfo : React.FC<IPostInfoProps> = ({ postInfo }) => {
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userLiked, setUserLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  useLayoutEffect(()=>{
    setUserLiked(postInfo.user_liked);
    setLikes(postInfo.likes);
  }, [postInfo]);

  const time = postInfo.updated_at ?
              new Date(postInfo.updated_at):
              new Date(postInfo.created_at);

  const updateTxt = postInfo.updated_at ? " (수정됨)" : "";

  const isAuthor = postInfo.is_author;

  const content = postInfo.content.split('\n').map((line, index) => (
    <span key={index}>
      {line}
      <br />
    </span>
  ));

  const handleLike = () => {
      if(!userLiked){
        sendCreatePostLikeRequest(postInfo.id).then((res)=>{
          if(res.status >= 400){
            console.log(res);
            return;
          }
          setLikes(likes+1);
          setUserLiked(true);
        });
      } else {
        sendDeletePostLikeRequest(postInfo.id).then((res)=>{
          if(res.status >= 400){
            console.log(res);
            return;
          }
          setLikes(likes-1);
          setUserLiked(false);
        });
      }
  };

  return (
    <div>
        { updateModalOpen ? <PostModal close={setUpdateModalOpen} originalPostData={postInfo}/> : null}
        { deleteModalOpen ? <DeleteModal close={setDeleteModalOpen} isAuthor={isAuthor} postId={postInfo.id}/> : null}
        <div className={PostHeader}>
            <div className={Title}>{postInfo.title}</div>
            <div className={EtcInfo}>
              <div className={EtcInfoItem}>
                <div>{postInfo.author_nickname}</div>
                <div>{dateToStr(time) + updateTxt}</div>
              </div>
              <div className={EtcInfoItem}>
                <div>{"조회 " + postInfo.views}</div>
                <div>{"좋아요 " + postInfo.likes}</div>
              </div>
            </div>
        </div>
        <div className={PostBody}>
            {content}
        </div>
        <div className={isAuthor ? FullButtons : OneButton}>
          {isAuthor ? <button className={AuthorBtn} onClick={()=>setUpdateModalOpen(true)}>수정</button> : null}
          <div className={LikeBtn} onClick={handleLike}>
            <AiFillLike color={userLiked ? "#36B700" : "#000000"} size={50}/>
            <div className={userLiked ? LikedColor : UnLikedColor}>{likes}</div>
          </div>
          {isAuthor ? <button className={AuthorBtn} onClick={()=>setDeleteModalOpen(true)}>삭제</button> : null}
        </div>
    </div>
  )
}

export default PostInfo