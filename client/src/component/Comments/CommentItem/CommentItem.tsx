import clsx from "clsx";
import { ReactNode, useMemo, useState } from "react";
import { IComment } from "shared";
import { dateToStr } from "../../../utils/date-to-str";
import CommentLikeButton from "../CommentLikeButton/CommentLikeButton";
import {
  commentHeader,
  commentContainer,
  commentBody,
  commentAuthor,
  commentTimestamp,
  isCommentUpdated,
  commentContent,
  commentEdit,
  commentFooter,
  commentEditButtons,
} from "./CommentItem.css";

interface ICommentItemProps {
  comment: IComment;
}

const CommentItem = ({ comment }: ICommentItemProps) => {
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

  return (
    <div className={commentContainer}>
      <div className={commentHeader}>
        <div className={commentAuthor}>{comment.author_nickname}</div>
        <div className={commentTimestamp}>
          {dateToStr(comment.created_at)}
          {comment.updated_at ? (
            <span className={isCommentUpdated}> (수정됨)</span>
          ) : null}
        </div>
      </div>

      <div className={commentBody}>
        {isEditMode ? (
          <textarea className={commentEdit} defaultValue="수정 폼" />
        ) : (
          <div className={commentContent}>{contentNodes}</div>
        )}
      </div>

      <div className={commentFooter}>
        <CommentLikeButton
          likes={comment.likes}
          userLiked={comment.user_liked}
        />

        {comment.is_author &&
          (isEditMode ? (
            <div className={clsx(commentEditButtons)}>
              <button onClick={() => alert("수정한 댓글 제출")}>완료</button>
              <button onClick={handleEditModeToggle}>취소</button>
            </div>
          ) : (
            <div className={clsx(commentEditButtons)}>
              <button onClick={handleEditModeToggle}>수정</button>
              <button onClick={() => alert("댓글 삭제 요청")}>삭제</button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CommentItem;
