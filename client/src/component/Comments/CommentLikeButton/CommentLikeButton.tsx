import { useLayoutEffect, useState } from "react";
import { AiFillLike } from "react-icons/ai";
import {
	sendCreateCommentLikeRequest,
	sendDeleteCommentLikeRequest,
} from "../../../api/likes/crud";
import { useUserStore } from "../../../state/store";
import { ApiCall } from "../../../api/api";
import { useGlobalErrorModal } from "../../../state/GlobalErrorModalStore";
import Button from "../../common/Button";
import { usePostInfo } from "../../../state/PostInfoStore";

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
	const globalErrorModal = useGlobalErrorModal();
	const {
		acceptedCommentId,
		hasAcceptedLikeToggle,
		setAcceptedCommentLikeToggled,
	} = usePostInfo();

	const [toggled, setToggled] = useState(false);

	const actualUserLiked = userLiked !== toggled; // XOR
	const diff = toggled ? (userLiked ? -1 : 1) : 0;

	useLayoutEffect(() => {
		if (
			commentId === acceptedCommentId &&
			toggled !== hasAcceptedLikeToggle
		) {
			setToggled(hasAcceptedLikeToggle);
		}
	}, [hasAcceptedLikeToggle]);

	const handleLikeClick = async () => {
		if (!isLogin) {
			globalErrorModal.open({
				title: "오류",
				message: "로그인이 필요합니다.",
			});
			return;
		}

		const response = await ApiCall(
			actualUserLiked
				? () => sendDeleteCommentLikeRequest(commentId)
				: () => sendCreateCommentLikeRequest(commentId),
			err =>
				globalErrorModal.openWithMessageSplit({
					messageWithTitle: err.message,
				})
		);

		if (response instanceof Error) {
			return;
		}

		setToggled(!toggled);

		if (commentId === acceptedCommentId) {
			setAcceptedCommentLikeToggled(!toggled);
		}
	};

	return (
		<Button
			className="flex flex-col items-center"
			variant="text"
			onClick={handleLikeClick}
		>
			<AiFillLike
				className={` ${actualUserLiked ? "text-green-500" : "text-gray-500 dark:text-gray-200"}`}
			/>
			<div
				className={` ${actualUserLiked ? "text-green-500" : "text-gray-500 dark:text-gray-200"}`}
			>
				{likes + diff}
			</div>
		</Button>
	);
};

export default CommentLikeButton;
