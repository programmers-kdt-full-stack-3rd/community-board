import { useState } from "react";
import { AiFillLike } from "react-icons/ai";
import { vars } from "../../../App.css";
import {
  sendCreateCommentLikeRequest,
  sendDeleteCommentLikeRequest,
} from "../../../api/likes/crud";
import { useUserStore } from "../../../state/store";
import { likeButton } from "./CommentLikeButton.css";
import { ApiCall } from "../../../api/api";
import { ClientError } from "../../../api/errors";
import { useErrorModal } from "../../../state/errorModalStore";

interface ICommentLikeButtonProps {
  commentId: number;
  likes: number;
  userLiked?: boolean;
}

const CommentLikeButton = ({
  commentId,
  likes,
  userLiked,
}: ICommentLikeButtonProps) => {
  const isLogin = useUserStore((state) => state.isLogin);
  const errorModal = useErrorModal();

  const [toggled, setToggled] = useState(false);

  const actualUserLiked = userLiked !== toggled; // XOR
  const diff = toggled ? (userLiked ? -1 : 1) : 0;

  const handleLikeClick = async () => {
    if (!isLogin) {
      alert("로그인이 필요합니다!");
      return;
    }

    const response = await ApiCall(
      actualUserLiked ?
      () => sendDeleteCommentLikeRequest(commentId)
      :
      () => sendCreateCommentLikeRequest(commentId),
      (err) => {
        errorModal.setErrorMessage(err.message);
        errorModal.open();
      }
    );

    if (response instanceof ClientError) {
      return;
    }

    setToggled(!toggled);
  };

  return (
    <button className={likeButton} onClick={handleLikeClick}>
      <AiFillLike
        color={actualUserLiked ? vars.color.successButton : "#808080"}
      />
      {likes + diff}
    </button>
  );
};

export default CommentLikeButton;
