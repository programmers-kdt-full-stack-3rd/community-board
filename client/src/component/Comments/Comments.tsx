import { useCallback, useLayoutEffect, useState } from "react";
import { IComment, mapDBToComments } from "shared";
import {
  sendGetCommentsRequest,
  sendPostCommentRequest,
} from "../../api/comments/crud";
import CommentForm from "./CommentForm/CommentForm";
import CommentItem from "./CommentItem/CommentItem";
import {
  commentCount,
  commentFormTitle,
  commentList,
  commentSection,
  commentSectionTitle,
  commentWriteSection,
  noComment,
} from "./Comments.css";

interface ICommentsProps {
  postId: number;
}

const Comments = ({ postId }: ICommentsProps) => {
  const [comments, setComments] = useState<IComment[]>([]);

  const fetchComments = useCallback(async () => {
    const data = await sendGetCommentsRequest(postId);

    if (data.status >= 400) {
      // TODO: 에러 핸들링
      console.error(data);
      return;
    }

    setComments(mapDBToComments(data.comments));
  }, [postId]);

  useLayoutEffect(() => {
    if (postId < 1) {
      return;
    }

    fetchComments();
  }, [postId]);

  const handleCommentCreate = async (content: string): Promise<boolean> => {
    try {
      const response = await sendPostCommentRequest({
        content,
        post_id: postId,
      });

      if (response?.status >= 400) {
        console.error(response);
        alert("댓글 작성에 실패했습니다.");
        return false;
      }

      fetchComments();
      alert("댓글을 작성했습니다.");
    } catch (error) {
      console.error(error);
      alert("댓글 작성에 실패했습니다.");
      return false;
    }

    return true;
  };

  const handleCommentUpdate = async () => {
    await fetchComments();
  };

  return (
    <div className={commentSection}>
      <h2 className={commentSectionTitle}>
        댓글<span className={commentCount}> ({comments.length}개)</span>
      </h2>

      <div className={commentWriteSection}>
        <h3 className={commentFormTitle}>새 댓글을 남겨 보세요.</h3>
        <CommentForm onSubmit={handleCommentCreate} />
      </div>

      <div className={commentList}>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onUpdate={handleCommentUpdate}
            />
          ))
        ) : (
          <p className={noComment}>
            아직 댓글이 없습니다.
            <br />첫 댓글을 작성해 보세요.
          </p>
        )}
      </div>
    </div>
  );
};

export default Comments;
