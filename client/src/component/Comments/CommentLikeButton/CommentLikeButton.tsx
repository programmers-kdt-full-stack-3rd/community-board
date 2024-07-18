import { useState } from "react";
import { AiFillLike } from "react-icons/ai";
import { vars } from "../../../App.css";
import {
  sendCreateCommentLikeRequest,
  sendDeleteCommentLikeRequest,
} from "../../../api/likes/crud";
import { useUserStore } from "../../../state/store";
import { likeButton } from "./CommentLikeButton.css";

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

  const [toggled, setToggled] = useState(false);

  const actualUserLiked = userLiked !== toggled; // XOR
  const diff = toggled ? (userLiked ? -1 : 1) : 0;

  const handleLikeClick = async () => {
    if (!isLogin) {
      alert("로그인이 필요합니다!");
      return;
    }

    let response;

    if (actualUserLiked) {
      response = await sendDeleteCommentLikeRequest(commentId);
    } else {
      response = await sendCreateCommentLikeRequest(commentId);
    }

    if (response?.status >= 400) {
      console.error(response);
      alert(`좋아요${actualUserLiked ? " 취소" : ""} 실패`);
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
