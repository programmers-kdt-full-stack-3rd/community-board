import { useState } from "react";
import { AiFillLike } from "react-icons/ai";

import {
	sendCreateCommentLikeRequest,
	sendDeleteCommentLikeRequest,
} from "../../../api/likes/crud";
import { useUserStore } from "../../../state/store";
import { ApiCall } from "../../../api/api";
import { ClientError } from "../../../api/errors";
import { useErrorModal } from "../../../state/errorModalStore";
import Button from "../../common/Button";

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
	const isLogin = useUserStore(state => state.isLogin);
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
			actualUserLiked
				? () => sendDeleteCommentLikeRequest(commentId)
				: () => sendCreateCommentLikeRequest(commentId),
			err => {
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
		<Button
			className="flex flex-col items-center"
			variant="text"
			onClick={handleLikeClick}
		>
			<AiFillLike
				className={` ${actualUserLiked ? "text-green-500" : "text-gray-200"}`}
			/>
			<div
				className={` ${actualUserLiked ? "text-green-500" : "text-gray-200"}`}
			>
				{likes + diff}
			</div>
		</Button>
	);
};

export default CommentLikeButton;
