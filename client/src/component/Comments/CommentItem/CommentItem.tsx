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
import { useErrorModal } from "../../../state/errorModalStore";
import { ClientError } from "../../../api/errors";
import Button from "../../common/Button";

interface ICommentItemProps {
	comment: IComment;
	onUpdate?: () => Promise<void>;
	onDelete?: () => Promise<void>;
}

const CommentItem = ({ comment, onUpdate, onDelete }: ICommentItemProps) => {
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
			() => sendPatchCommentRequest({ content, id: comment.id }),
			err => {
				errorModal.setErrorMessage(err.message);
				errorModal.open();
			}
		);

		if (res instanceof ClientError) {
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
			err => {
				errorModal.setErrorMessage(err.message);
				errorModal.open();
			}
		);

		if (res instanceof ClientError) {
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
			<div className="flex-grow">
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
						<div className="mb-4">{contentNodes}</div>
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
