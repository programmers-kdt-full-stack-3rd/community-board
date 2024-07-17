import { IComment, mapDBToComments } from "shared";
import CommentItem from "./CommentItem/CommentItem";
import { useLayoutEffect, useState } from "react";
import { sendGetCommentsRequest } from "../../api/comments/crud";
import {
  commentCount,
  commentList,
  commentSection,
  commentSectionTitle,
} from "./Comments.css";

interface ICommentsProps {
  postId: number;
}

const Comments = ({ postId }: ICommentsProps) => {
  const [comments, setComments] = useState<IComment[]>([]);

  useLayoutEffect(() => {
    sendGetCommentsRequest(postId).then((data) => {
      if (data.status >= 400) {
        // TODO: 에러 핸들링
        console.log(data);
        return;
      }

      setComments(mapDBToComments(data.comments));
    });
  }, [postId]);

  return (
    <div className={commentSection}>
      <h2 className={commentSectionTitle}>
        댓글<span className={commentCount}> ({comments.length}개)</span>
      </h2>

      <div className={commentList}>
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default Comments;
