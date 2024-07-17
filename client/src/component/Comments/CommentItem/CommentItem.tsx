import { ReactNode, useMemo, useState } from "react";
import { IComment } from "shared";
import {
  sendDeleteCommentRequest,
  sendPatchCommentRequest,
} from "../../../api/comments/crud";
import { dateToStr } from "../../../utils/date-to-str";
import CommentForm from "../CommentForm/CommentForm";
import CommentLikeButton from "../CommentLikeButton/CommentLikeButton";
import {
  commentHeader,
  commentContainer,
  commentBody,
  commentAuthor,
  commentTimestamp,
  isCommentUpdated,
  commentContent,
  commentFooter,
  commentEditButtons,
} from "./CommentItem.css";

interface ICommentItemProps {
  comment: IComment;
  onUpdate?: () => Promise<void>;
}

const CommentItem = ({ comment, onUpdate }: ICommentItemProps) => {
  const [isEditMode, setIsEditMode] = useState(false);

  const contentNodes = useMemo(
    () =>
      comment.content
        .split("\n")
        .reduce<ReactNode[]>((acc, paragraph, index) => {
          if (index !== 0) {
            acc.push(<br key={index} />);
          }
          acc.push(paragraph);
          return acc;
        }, []),
    [comment.content]
  );

  const handleEditModeToggle = () => {
    setIsEditMode(!isEditMode);
  };

  const handleEditionSubmit = async (content: string): Promise<boolean> => {
    try {
      const response = await sendPatchCommentRequest({
        content,
        id: comment.id,
      });

      if (response?.status >= 400) {
        console.error(response);
        alert("댓글 수정에 실패했습니다.");
        return false;
      }

      alert("댓글을 수정했습니다.");
    } catch (error) {
      console.error(error);
      alert("댓글 수정에 실패했습니다.");
      return false;
    }

    if (onUpdate) {
      await onUpdate();
    }

    return true;
  };

  const handleDeleteClick = async () => {
    const accepted = confirm("댓글을 정말로 삭제할까요?");

    if (!accepted) {
      return;
    }

    try {
      const response = await sendDeleteCommentRequest(comment.id);

      if (response?.status >= 400) {
        console.error(response);
        alert("댓글 삭제에 실패했습니다.");
        return false;
      }

      alert("댓글을 삭제했습니다.");
    } catch (error) {
      console.error(error);
      alert("댓글 삭제에 실패했습니다.");
      return false;
    }

    if (onUpdate) {
      await onUpdate();
    }

    setIsEditMode(false);

    return true;
  };

  return (
    <div className={commentContainer}>
      <div className={commentHeader}>
        <div className={commentAuthor}>{comment.author_nickname}</div>
        <div className={commentTimestamp}>
          {dateToStr(comment.created_at)}
          {comment.updated_at ? (
            <>
              {" "}
              <span
                className={isCommentUpdated}
                title={`최종 수정: ${dateToStr(comment.updated_at)}`}
              >
                (수정됨)
              </span>
            </>
          ) : null}
        </div>
      </div>

      <div className={commentBody}>
        {isEditMode ? (
          <CommentForm
            defaultContent={comment.content}
            isUpdateMode={true}
            onSubmit={handleEditionSubmit}
            onCancel={handleEditModeToggle}
          />
        ) : (
          <div className={commentContent}>{contentNodes}</div>
        )}
      </div>

      {isEditMode || (
        <div className={commentFooter}>
          <CommentLikeButton
            likes={comment.likes}
            userLiked={comment.user_liked}
          />

          {comment.is_author && (
            <div className={commentEditButtons}>
              <button onClick={handleEditModeToggle}>수정</button>
              <button onClick={handleDeleteClick}>삭제</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
