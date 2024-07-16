import { useState } from "react";
import { AiFillLike } from "react-icons/ai";
import { vars } from "../../../App.css";
import { useUserStore } from "../../../state/store";
import { likeButton } from "./CommentLikeButton.css";

interface ICommentLikeButtonProps {
  likes: number;
  userLiked?: boolean;
}

const CommentLikeButton = ({ likes, userLiked }: ICommentLikeButtonProps) => {
  const isLogin = useUserStore((state) => state.isLogin);

  const [toggled, setToggled] = useState(false);

  const actualUserLiked = userLiked !== toggled; // XOR
  const diff = toggled ? (userLiked ? -1 : 1) : 0;

  const handleLikeClick = () => {
    if (!isLogin) {
      alert("로그인이 필요합니다!");
      return;
    }

    if (actualUserLiked) {
      // TODO: 좋아요 취소 요청 후 성공 응답 시 상태 변경
      setToggled(!toggled);
    } else {
      // TODO: 좋아요 활성화 요청 후 성공 응답 시 상태 변경
      setToggled(!toggled);
    }
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
