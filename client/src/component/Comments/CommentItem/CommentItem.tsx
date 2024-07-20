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
import { ApiCall } from "../../../api/api";
import { useErrorModal } from "../../../state/errorModalStore";
import { ClientError } from "../../../api/errors";

interface ICommentItemProps {
  comment: IComment;
  onUpdate?: () => Promise<void>;
}

const CommentItem = ({ comment, onUpdate }: ICommentItemProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const errorModal = useErrorModal();

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
    const trimmedContent = content.trim();

    if (trimmedContent === comment.content) {
      errorModal.setErrorMessage("error:댓글 내용이 이전과 동일합니다.");
      errorModal.open();
      return false;
    }

    const res = await ApiCall(
        () => sendPatchCommentRequest({content,id: comment.id}),
        (err) => {
          errorModal.setErrorMessage(err.message);
          errorModal.open();
        }
    );

    if(res instanceof ClientError){
      return false;
    }

    alert("댓글을 수정했습니다.");

    if (onUpdate) {
      await onUpdate();
    }

    setIsEditMode(false);

    return true;
  };

  const handleDeleteClick = async () => {
    const accepted = confirm("댓글을 정말로 삭제할까요?");

    if (!accepted) {
      return;
    }

    const res = await ApiCall(
      () => sendDeleteCommentRequest(comment.id),
      (err) => {
        errorModal.setErrorMessage(err.message);
        errorModal.open();
      }
    );

    if (res instanceof ClientError){
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
            commentId={comment.id}
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
