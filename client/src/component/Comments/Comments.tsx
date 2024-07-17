import { useLayoutEffect, useState } from "react";
import { IComment, mapDBToComments } from "shared";
import {
  sendGetCommentsRequest,
  sendPostCommentRequest,
} from "../../api/comments/crud";
import CommentForm from "./CommentForm/CommentForm";
import CommentItem from "./CommentItem/CommentItem";
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
  const [submissionTime, setSubmissionTime] = useState(0);
  const [comments, setComments] = useState<IComment[]>([]);

  useLayoutEffect(() => {
    if (postId < 1) {
      return;
    }

    sendGetCommentsRequest(postId).then((data) => {
      if (data.status >= 400) {
        // TODO: 에러 핸들링
        console.log(data);
        return;
      }

      setComments(mapDBToComments(data.comments));
    });
  }, [postId, submissionTime]);

  const handleCommentCreate = async (content: string): Promise<boolean> => {
    try {
      const response = await sendPostCommentRequest({
        content,
        post_id: postId,
      });

      if (response?.status >= 400) {
        alert("댓글 작성에 실패했습니다.");
        return false;
      }

      setSubmissionTime(Date.now());
      alert("댓글을 작성했습니다.");
    } catch (error) {
      console.error(error);
      alert("댓글 작성에 실패했습니다.");
      return false;
    }

    return true;
  };

  return (
    <div className={commentSection}>
      <h2 className={commentSectionTitle}>
        댓글<span className={commentCount}> ({comments.length}개)</span>
      </h2>

      <CommentForm onSubmit={handleCommentCreate} />

      <div className={commentList}>
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default Comments;
