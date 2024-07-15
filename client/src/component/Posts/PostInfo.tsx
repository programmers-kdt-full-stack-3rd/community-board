import { EtcInfo, EtcInfoItem, FullButtons, OneButton, PostBody, PostHeader, Title } from "./PostInfo.css";
import { dateToStr } from "../../utils/date-to-str";
import { IPostInfo } from "shared";

interface IPostInfoProps {
  postInfo : IPostInfo
}

const PostInfo : React.FC<IPostInfoProps> = ({ postInfo }) => {
  const time = postInfo.updated_at ?
              new Date(postInfo.updated_at):
              new Date(postInfo.created_at);

  const updateTxt = postInfo.updated_at ? " (수정됨)" : "";

  const content = postInfo.content.split('\n').map((line, index) => (
    <span key={index}>
      {line}
      <br />
    </span>
  ));

  const isLogin = false;

  return (
    <div>
        <div className={PostHeader}>
            {/* flex col */}
            <div className={Title}>{postInfo.title}</div>
            <div className={EtcInfo}>
              {/* flex between */}
              <div className={EtcInfoItem}>
                {/* 왼쪽 flex row */}
                <div>{postInfo.author_nickname}</div>
                <div>{dateToStr(time) + updateTxt}</div>
              </div>
              <div className={EtcInfoItem}>
                {/* 오른쪽 flex row */}
                <div>{"조회 " + postInfo.views}</div>
                <div>{"좋아요 " + postInfo.likes}</div>
              </div>
            </div>
        </div>
        <div className={PostBody}>
            {content}
        </div>
        <div className={isLogin ? FullButtons : OneButton}>
          {/* TODO : 로그인 여부에 따라 버튼 숨기기 */}
          {isLogin ? <button>수정</button> : null}
          <button>좋아요</button>
          {isLogin ? <button>삭제</button> : null}
        </div>
    </div>
  )
}

export default PostInfo