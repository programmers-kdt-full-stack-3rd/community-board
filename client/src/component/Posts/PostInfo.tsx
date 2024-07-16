import { EtcInfo, EtcInfoItem, FullButtons, OneButton, PostBody, PostHeader, Title } from "./PostInfo.css";
import { dateToStr } from "../../utils/date-to-str";
import { IPostInfo } from "shared";
import { useState } from "react";
import PostModal from "./Modal/PostModal";
import DeleteModal from "./Modal/DeleteModal";

interface IPostInfoProps {
  postInfo : IPostInfo
}

const PostInfo : React.FC<IPostInfoProps> = ({ postInfo }) => {
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

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
          {isAuthor ? <button onClick={()=>setUpdateModalOpen(true)}>수정</button> : null}
          <button>좋아요</button>
          {isAuthor ? <button onClick={()=>setDeleteModalOpen(true)}>삭제</button> : null}
        </div>
    </div>
  )
}

export default PostInfo