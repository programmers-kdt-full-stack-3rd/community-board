import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useSearchParams } from "react-router-dom";
import { IComment, mapDBToComments } from "shared";
import {
	sendGetCommentsRequest,
	sendPostCommentRequest,
} from "../../api/comments/crud";
import Pagination from "../common/Pagination/Pagination";
import CommentForm from "./CommentForm/CommentForm";
import CommentItem from "./CommentItem/CommentItem";
import { ApiCall } from "../../api/api";
import { useGlobalErrorModal } from "../../state/GlobalErrorModalStore";
import { useNavigate, useParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { usePostInfo } from "../../state/PostInfoStore";

const Comments: React.FC = () => {
	const [comments, setComments] = useState<IComment[]>([]);
	const [total, setTotal] = useState(0);

	const { post, acceptedCommentId } = usePostInfo();
	const acceptedComment = useMemo(
		() => comments.find(({ id }) => id === acceptedCommentId),
		[comments, acceptedCommentId]
	);

	const globalErrorModal = useGlobalErrorModal();
	const navigate = useNavigate();

	const { id } = useParams();
	const [searchParams, setSearchParams] = useSearchParams();

	const commentListRef = useRef<HTMLDivElement>(null);

	const perPage = Number(searchParams.get("comment_perPage")) || 50;
	const currentPage =
		Number(searchParams.get("comment_index")) || Math.ceil(total / perPage);

	const fetchComments = useCallback(async () => {
		const requestSearchParams = new URLSearchParams([
			["post_id", String(post.id)],
			["index", searchParams.get("comment_index") || ""],
			["perPage", searchParams.get("comment_perPage") || ""],
		]);

		const queryString = `?${requestSearchParams.toString()}`;

		const res = await ApiCall(
			() => sendGetCommentsRequest(queryString),
			() =>
				globalErrorModal.open({
					title: "오류",
					message: "댓글을 불러오지 못했습니다.",
					callback: window.location.reload,
				})
		);

		if (res instanceof Error) {
			return;
		}

		setComments(mapDBToComments(res.comments));
		setTotal(res.total);
	}, [post.id, searchParams]);

	useEffect(() => {
		if (post.id < 1) {
			return;
		}

		fetchComments();
	}, [post.id, searchParams]);

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
			() => sendPostCommentRequest({ content, post_id: post.id }),
			err =>
				globalErrorModal.openWithMessageSplit({
					messageWithTitle: err.message,
					callback: () => navigate(`/login?redirect=/post/${id}`),
				})
		);

		if (res instanceof Error) {
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
		<div className="my-5 box-border flex w-[800px] flex-col items-stretch justify-start gap-5 text-left">
			{acceptedComment && (
				<div className="mb-12">
					<div className="mb-3 flex items-center gap-1 text-xl font-bold text-green-600 dark:text-green-500">
						<FaCheckCircle size="0.875em" />
						작성자가 채택한 댓글
					</div>

					<CommentItem
						comment={acceptedComment}
						isAcceptanceHidden={true}
					/>
				</div>
			)}

			<div>
				<div className="flex items-baseline gap-6">
					<div className="text-xl font-bold">
						{acceptedComment && "모든 "}댓글 {total}
					</div>
					{acceptedComment && (
						<div className="text-center text-sm text-gray-700 dark:text-gray-200">
							채택을 완료한 게시글에서는 댓글을 작성·수정·삭제할
							수 없습니다.
						</div>
					)}
				</div>
				<hr className="dark:bg-customGray mt-3 h-0.5 border-none bg-gray-300" />
			</div>

			{!acceptedComment && (
				<div className="flex flex-col items-start gap-2">
					<div className="text-sm text-gray-700 dark:text-gray-200">
						새로운 댓글을 남겨보세요
					</div>
					<CommentForm onSubmit={handleCommentCreate} />
				</div>
			)}

			<div
				className="flex flex-col gap-5"
				ref={commentListRef}
			>
				{comments.length > 0 ? (
					comments.map(comment => (
						<CommentItem
							key={`${comment.id}-${comment.user_liked}`}
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
