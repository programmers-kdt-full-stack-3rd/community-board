import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import { useUserStore } from "../../../state/store";
import {
	button,
	commentFormContainer,
	footer,
	textArea,
} from "./CommentForm.css";

interface ICommentFormProps {
	defaultContent?: string;
	isUpdateMode?: boolean;
	onSubmit: (content: string) => Promise<boolean>;
	onCancel?: () => void;
}

const CommentForm = ({
	defaultContent,
	isUpdateMode,
	onSubmit,
	onCancel,
}: ICommentFormProps) => {
	const isLogin = useUserStore(state => state.isLogin);

	const [content, setContent] = useState(defaultContent || "");

	const handleFormSubmit = useCallback(
		async (event: FormEvent) => {
			event.preventDefault();

			const trimmedContent = content.trim();
			if (!trimmedContent) {
				alert("댓글 내용을 입력하세요.");
				return;
			}

			const success = await onSubmit(trimmedContent);
			if (success) {
				setContent("");
			}
		},
		[content, onSubmit]
	);

	const handleContentChange = useCallback(
		(event: ChangeEvent<HTMLTextAreaElement>) => {
			setContent(event.target.value);
		},
		[]
	);

	const handleCancelClick = useCallback(() => {
		if (onCancel) {
			onCancel();
		}
	}, [onCancel]);

	return (
		<form
			className={commentFormContainer}
			onSubmit={handleFormSubmit}
		>
			<textarea
				className={textArea}
				value={
					isLogin ? content : "댓글을 작성하려면 로그인이 필요합니다."
				}
				disabled={!isLogin}
				onChange={handleContentChange}
			/>

			<div className={footer}>
				<button
					type="submit"
					className={button}
					disabled={!isLogin}
				>
					{isUpdateMode ? "수정" : "등록"}
				</button>
				{isUpdateMode && (
					<button
						type="button"
						className={button}
						onClick={handleCancelClick}
					>
						취소
					</button>
				)}
			</div>
		</form>
	);
};

export default CommentForm;
