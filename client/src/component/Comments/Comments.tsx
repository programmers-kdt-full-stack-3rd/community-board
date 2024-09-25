import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { IComment, mapDBToComments } from "shared";
import {
	sendGetCommentsRequest,
	sendPostCommentRequest,
} from "../../api/comments/crud";
import Pagination from "../common/Pagination/Pagination";
import CommentForm from "./CommentForm/CommentForm";
import CommentItem from "./CommentItem/CommentItem";
import { commentList, commentSection } from "./Comments.css";
import { ApiCall } from "../../api/api";
import { ClientError } from "../../api/errors";
import { useErrorModal } from "../../state/errorModalStore";
import { useNavigate, useParams } from "react-router-dom";

interface ICommentsProps {
	postId: number;
}

const Comments = ({ postId }: ICommentsProps) => {
	const [comments, setComments] = useState<IComment[]>([]);
	const [total, setTotal] = useState(0);

	const errorModal = useErrorModal();
	const navigate = useNavigate();
	const { id } = useParams();
	const [searchParams, setSearchParams] = useSearchParams();

	const commentListRef = useRef<HTMLDivElement>(null);

	const perPage = Number(searchParams.get("comment_perPage")) || 50;
	const currentPage =
		Number(searchParams.get("comment_index")) || Math.ceil(total / perPage);

	const fetchComments = useCallback(async () => {
		const requestSearchParams = new URLSearchParams([
			["post_id", String(postId)],
			["index", searchParams.get("comment_index") || ""],
			["perPage", searchParams.get("comment_perPage") || ""],
		]);

		const queryString = `?${requestSearchParams.toString()}`;

		const res = await ApiCall(
			() => sendGetCommentsRequest(queryString),
			() => {
				errorModal.setErrorMessage("error:댓글을 불러오지 못했습니다.");
				errorModal.setOnError(window.location.reload);
				errorModal.open();
			}
		);

		if (res instanceof ClientError) {
			return;
		}

		setComments(mapDBToComments(res.comments));
		setTotal(res.total);
	}, [postId, searchParams]);

	useLayoutEffect(() => {
		if (postId < 1) {
			return;
		}

		fetchComments();
	}, [postId, searchParams]);

	const goToLastPage = async () => {
		if (searchParams.get("comment_index")) {
			const nextSearchParams = new URLSearchParams(searchParams);
			nextSearchParams.delete("comment_index");
			setSearchParams(nextSearchParams);
		} else {
			await fetchComments();
		}
	};

	const handleCommentCreate = async (content: string): Promise<boolean> => {
		const res = await ApiCall(
			() => sendPostCommentRequest({ content, post_id: postId }),
			() => {
				errorModal.setOnError(() =>
					navigate(`/login?redirect=/post/${id}`)
				);
			}
		);

		if (res instanceof ClientError) {
			errorModal.setErrorMessage(res.message);
			errorModal.open();
			return false;
		}

		await goToLastPage();

		return true;
	};

	const handleCommentUpdate = async () => {
		await fetchComments();
	};

	const handleCommentDelete = async () => {
		const isSingleCommentOfLastPage = currentPage > (total - 1) / 50;

		if (isSingleCommentOfLastPage) {
			await goToLastPage();
		} else {
			await fetchComments();
		}
	};

	const handlePageChange = async (page: number) => {
		const nextSearchParams = new URLSearchParams(searchParams);
		nextSearchParams.set("comment_index", String(page));

		setSearchParams(nextSearchParams);

		const commentListY =
			window.scrollY +
			(commentListRef.current?.getBoundingClientRect().y ?? 0);
		window.scrollTo({ top: commentListY - 40 });
	};

	return (
		<div className={commentSection}>
			<div>
				<span className="text-xl font-bold">댓글 {total}</span>
				<hr className="bg-customGray mt-3 h-0.5 border-none"></hr>
			</div>

			<div className="flex flex-col items-start gap-2">
				<span className="text-sm text-gray-200">
					새로운 댓글을 남겨보세요
				</span>
				<CommentForm onSubmit={handleCommentCreate} />
			</div>

			<div
				className={commentList}
				ref={commentListRef}
			>
				{comments.length > 0 ? (
					comments.map(comment => (
						<CommentItem
							key={comment.id}
							comment={comment}
							onUpdate={handleCommentUpdate}
							onDelete={handleCommentDelete}
						/>
					))
				) : (
					<p className="text-customGray text-center text-base font-bold">
						아직 댓글이 없습니다. 첫 댓글을 작성해 보세요.
					</p>
				)}
			</div>

			{total > 50 && (
				<Pagination
					currentPage={currentPage}
					totalPosts={total}
					perPage={perPage}
					onChange={handlePageChange}
				/>
			)}
		</div>
	);
};

export default Comments;
