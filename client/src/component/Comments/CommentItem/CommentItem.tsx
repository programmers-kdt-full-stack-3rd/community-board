import React, { ReactNode, useMemo, useState } from "react";
import { IComment } from "shared";
import {
	sendDeleteCommentRequest,
	sendPatchCommentRequest,
} from "../../../api/comments/crud";
import { sendQnaAcceptCommentRequest } from "../../../api/posts/qna_crud";
import { dateToStr } from "../../../utils/date-to-str";
import CommentForm from "../CommentForm/CommentForm";
import CommentLikeButton from "../CommentLikeButton/CommentLikeButton";
import { ApiCall } from "../../../api/api";
import { useGlobalErrorModal } from "../../../state/GlobalErrorModalStore";
import Button from "../../common/Button";
import { FaCheckCircle } from "react-icons/fa";
import { usePostInfo } from "../../../state/PostInfoStore";
import ConfirmModal from "../../common/Modal/ConfirmModal";
import { useModal } from "../../../hook/useModal";

interface ICommentItemProps {
	comment: IComment;
	isAcceptanceHidden?: boolean;
	onUpdate?: () => Promise<void>;
	onDelete?: () => Promise<void>;
}

const CommentItem: React.FC<ICommentItemProps> = ({
	comment,
	isAcceptanceHidden = false,
	onUpdate,
	onDelete,
}) => {
	const [isEditMode, setIsEditMode] = useState(false);

	const globalErrorModal = useGlobalErrorModal();
	const acceptConfirmModal = useModal();
	const deleteConfirmModal = useModal();

	const { post, isQnaCategory, acceptedCommentId, fetchPost } = usePostInfo();

	const isAccepted = isQnaCategory && acceptedCommentId === comment.id;
	const isAcceptable = isQnaCategory && acceptedCommentId === null;
	const isLocked = isQnaCategory && acceptedCommentId !== null;

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

	const handleAccept = async () => {
		post.id;

		const res = await ApiCall(
			() =>
				sendQnaAcceptCommentRequest({
					postId: post.id,
					commentId: comment.id,
				}),
			err =>
				globalErrorModal.openWithMessageSplit({
					messageWithTitle: err.message,
				})
		);

		if (res instanceof Error) {
			return;
		}

		acceptConfirmModal.close();
		globalErrorModal.open({
			variant: "info",
			title: "안내",
			message: "댓글을 채택했습니다.",
		});
		fetchPost(post.id);
	};

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

	const handleDelete = async () => {
		deleteConfirmModal.close();

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

		if (typeof onDelete === "function") {
			await onDelete();
		}

		setIsEditMode(false);

		return true;
	};

	return (
		<div className="border-b-customGray flex w-full border-spacing-3 flex-row items-center justify-between border-b">
			<ConfirmModal
				isOpen={acceptConfirmModal.isOpen}
				variant="warning"
				okButtonLabel="채택하기"
				onAccept={handleAccept}
				onClose={acceptConfirmModal.close}
			>
				<ConfirmModal.Title>댓글 채택 확인</ConfirmModal.Title>
				<ConfirmModal.Body>
					이 댓글을 정말로 채택할까요?
					<br />
					댓글을 채택한 이후에는 이 게시글을 수정·삭제할 수 없게 되며,
					이 게시글의 댓글도 작성·수정·삭제를 할 수 없게 됩니다.
				</ConfirmModal.Body>
			</ConfirmModal>

			<ConfirmModal
				isOpen={deleteConfirmModal.isOpen}
				variant="warning"
				okButtonColor="danger"
				okButtonLabel="댓글 삭제"
				onAccept={handleDelete}
				onClose={deleteConfirmModal.close}
			>
				<ConfirmModal.Title>댓글 삭제 확인</ConfirmModal.Title>
				<ConfirmModal.Body>댓글을 정말로 삭제할까요?</ConfirmModal.Body>
			</ConfirmModal>

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
						{isAccepted && !isAcceptanceHidden && (
							<div className="ml-2 flex items-center gap-1 font-bold text-green-600 dark:text-green-500">
								<FaCheckCircle size="0.875em" />
								<span>작성자가 채택한 댓글</span>
							</div>
						)}
					</div>

					<div className="flex gap-1">
						{post.is_author && isAcceptable && !isEditMode && (
							<Button
								color="action"
								size="small"
								variant="text"
								onClick={acceptConfirmModal.open}
							>
								채택하기
							</Button>
						)}
						{comment.is_author && !isEditMode && !isLocked && (
							<>
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
									onClick={deleteConfirmModal.open}
								>
									삭제
								</Button>
							</>
						)}
					</div>
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
