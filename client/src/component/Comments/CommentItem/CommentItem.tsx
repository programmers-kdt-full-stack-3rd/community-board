import { ReactNode, useMemo, useState } from "react";
import { IComment } from "shared";
import {
	sendDeleteCommentRequest,
	sendPatchCommentRequest,
} from "../../../api/comments/crud";
import { dateToStr } from "../../../utils/date-to-str";
import CommentForm from "../CommentForm/CommentForm";
import CommentLikeButton from "../CommentLikeButton/CommentLikeButton";
import { ApiCall } from "../../../api/api";
import { useGlobalErrorModal } from "../../../state/GlobalErrorModalStore";
import Button from "../../common/Button";

interface ICommentItemProps {
	comment: IComment;
	onUpdate?: () => Promise<void>;
	onDelete?: () => Promise<void>;
}

const CommentItem = ({ comment, onUpdate, onDelete }: ICommentItemProps) => {
	const [isEditMode, setIsEditMode] = useState(false);
	const globalErrorModal = useGlobalErrorModal();

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
			globalErrorModal.open({
				title: "오류",
				message: "댓글 내용이 이전과 동일합니다.",
			});
			return false;
		}

		const res = await ApiCall(
			() => sendPatchCommentRequest({ content, id: comment.id }),
			err =>
				globalErrorModal.openWithMessageSplit({
					messageWithTitle: err.message,
				})
		);

		if (res instanceof Error) {
			return false;
		}

		globalErrorModal.open({
			variant: "info",
			title: "댓글 수정 완료",
			message: "댓글을 수정했습니다.",
		});

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
			err =>
				globalErrorModal.openWithMessageSplit({
					messageWithTitle: err.message,
				})
		);

		if (res instanceof Error) {
			return false;
		}

		if (onDelete) {
			await onDelete();
		}

		setIsEditMode(false);

		return true;
	};

	return (
		<div className="border-b-customGray flex w-full border-spacing-3 flex-row items-center justify-between border-b">
			<div className="max-w-[750px] flex-grow">
				<div className="mb-2 flex flex-row items-center justify-between">
					<div className="flex flex-row items-center gap-2">
						<div className="font-bold">
							{comment.author_nickname}
						</div>
						<div className="text-gray-500">
							{dateToStr(comment.created_at)}
							{comment.updated_at ? (
								<>
									{" "}
									<span
										title={`최종 수정: ${dateToStr(comment.updated_at)}`}
									>
										(수정됨)
									</span>
								</>
							) : null}
						</div>
					</div>

					{comment.is_author && !isEditMode && (
						<div className="flex gap-1">
							<Button
								className="dark:text-white"
								size="small"
								variant="text"
								onClick={handleEditModeToggle}
							>
								수정
							</Button>
							<Button
								size="small"
								variant="text"
								color="danger"
								onClick={handleDeleteClick}
							>
								삭제
							</Button>
						</div>
					)}
				</div>

				<div>
					{isEditMode ? (
						<CommentForm
							defaultContent={comment.content}
							isUpdateMode={true}
							onSubmit={handleEditionSubmit}
							onCancel={handleEditModeToggle}
						/>
					) : (
						<div className="mb-4 max-w-full break-words">
							{contentNodes}
						</div>
					)}
				</div>
			</div>

			<div className="flex-none">
				{!isEditMode && (
					<CommentLikeButton
						commentId={comment.id}
						likes={comment.likes}
						userLiked={comment.user_liked}
					/>
				)}
			</div>
		</div>
	);
};

export default CommentItem;
