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
import { ApiCall } from "../../api/api";
import { ClientError } from "../../api/errors";
import { useErrorModal } from "../../state/errorModalStore";
import { useNavigate, useParams } from "react-router-dom";

interface ICommentsProps {
  postId: number;
}

const Comments = ({ postId }: ICommentsProps) => {
  const [comments, setComments] = useState<IComment[]>([]);
  const errorModal = useErrorModal();
  const navigate = useNavigate();
  const { id } = useParams();

  const fetchComments = useCallback(async () => {
    const res = await ApiCall(
      ()=>sendGetCommentsRequest(postId),
      ()=>{
        errorModal.setErrorMessage("error:댓글을 불러오지 못했습니다.");
        errorModal.setOnError(window.location.reload);
        errorModal.open();
      }
    );

    if (res instanceof ClientError) {
      return;
    }

    setComments(mapDBToComments(res.comments));
  }, [postId]);

  useLayoutEffect(() => {
    if (postId < 1) {
      return;
    }

    fetchComments();
  }, [postId]);

  const handleCommentCreate = async (content: string): Promise<boolean> => {
    const res = await ApiCall(
      () => sendPostCommentRequest({content, post_id: postId}),
      () => {
        errorModal.setOnError(()=>navigate(`/login?redirect=/post/${id}`));
      }
    );

    if (res instanceof ClientError) {
      errorModal.setErrorMessage(res.message);
      errorModal.open();
      return false;
    }

    fetchComments();
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
