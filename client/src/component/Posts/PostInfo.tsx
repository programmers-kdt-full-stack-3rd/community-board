import { dateToStr } from "../../utils/date-to-str";
import { useCallback, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	sendCreatePostLikeRequest,
	sendDeletePostLikeRequest,
} from "../../api/likes/crud";
import { useUserStore } from "../../state/store";
import { ApiCall } from "../../api/api";
import { useGlobalErrorModal } from "../../state/GlobalErrorModalStore";
import Button from "../common/Button";
import { IoEyeOutline } from "react-icons/io5";
import { FaRegThumbsUp } from "react-icons/fa6";
import ConfirmModal from "../common/Modal/ConfirmModal";
import { sendDeletePostRequest } from "../../api/posts/crud";
import { useModal } from "../../hook/useModal";
import useCategory from "../../hook/useCategory";
import { FaCheck } from "react-icons/fa";
import { usePostInfo } from "../../state/PostInfoStore";

const PostInfo: React.FC = () => {
	const navigate = useNavigate();
	const { post, acceptedCommentId, isQnaCategory } = usePostInfo();
	const isAcceptedQna = isQnaCategory && acceptedCommentId !== null;

	const { currentCategory } = useCategory(post.category);

	const deleteModal = useModal();
	const globalErrorModal = useGlobalErrorModal();

	const [userLiked, setUserLiked] = useState(false);
	const [likes, setLikes] = useState(0);

	useLayoutEffect(() => {
		setUserLiked(post.user_liked);
		setLikes(post.likes);
	}, [post.user_liked, post.likes]);

	const time = post.updated_at
		? new Date(post.updated_at)
		: new Date(post.created_at);
	const updateTxt = post.updated_at ? " (수정됨)" : "";
	const isAuthor = post.is_author;
	const content = post.content;

	const isLogin = useUserStore(state => state.isLogin);

	const handleLike = async () => {
		if (!isLogin) {
			globalErrorModal.open({
				title: "오류",
				message: "로그인이 필요합니다.",
				callback: () => navigate("/login"),
			});
			return;
		}

		const res = await ApiCall(
			userLiked
				? () => sendDeletePostLikeRequest(post.id)
				: () => sendCreatePostLikeRequest(post.id),
			err =>
				globalErrorModal.openWithMessageSplit({
					messageWithTitle: err.message,
				})
		);

		if (res instanceof Error) {
			return;
		}

		if (userLiked) {
			setLikes(likes - 1);
			setUserLiked(false);
		} else {
			setLikes(likes + 1);
			setUserLiked(true);
		}
	};

	const handleUpdate = () => {
		const url = `/post/new?postId=${post.id}&title=${encodeURIComponent(post.title)}&content=${encodeURIComponent(post.content)}`;

		navigate(url);
	};

	const handlePostDelete = useCallback(async () => {
		if (!isAuthor) {
			globalErrorModal.open({
				title: "오류",
				message: "삭제 권한이 없습니다.",
			});
			return;
		}

		const res = await ApiCall(
			() => sendDeletePostRequest(post.id.toString()),
			err => {
				deleteModal.close();
				globalErrorModal.openWithMessageSplit({
					messageWithTitle: err.message,
				});
			}
		);

		if (res instanceof Error) {
			return;
		}

		deleteModal.close();
		alert("삭제에 성공했습니다.");
		navigate(currentCategory?.path ?? "/");
	}, [isAuthor]);

	return (
		<div>
			<ConfirmModal
				variant="warning"
				isOpen={deleteModal.isOpen}
				okButtonColor="danger"
				okButtonLabel="삭제"
				onAccept={handlePostDelete}
				onClose={deleteModal.close}
			>
				<ConfirmModal.Title>게시글 삭제 확인</ConfirmModal.Title>
				<ConfirmModal.Body>
					정말로 이 게시글을 삭제할까요?
				</ConfirmModal.Body>
			</ConfirmModal>

			<div className="flex w-[800px] flex-col pb-2.5 pt-2.5">
				<div className="dark:bg-customGray relative mb-4 mt-4 flex flex-col justify-between rounded-lg bg-blue-900 text-left">
					<span className="m-5 text-lg font-bold text-white">
						{currentCategory?.name}
					</span>
				</div>

				<div className="border-b-customGray border-t-customGray border-spacing-3 border-y">
					<div className="mb-2 mt-4 flex items-center gap-3 text-left">
						{isAcceptedQna && (
							<div className="flex items-center gap-1 rounded-md bg-green-600/20 px-2 py-1 text-sm font-bold text-green-800 dark:text-green-400">
								<FaCheck size="0.875em" />
								<span>채택 완료</span>
							</div>
						)}
						<div className="text-2xl font-bold">{post.title}</div>
					</div>

					<div className="mb-4 flex items-center justify-between">
						<div className="flex items-center gap-2 text-lg">
							<div>{post.author_nickname}</div>
							<div>{dateToStr(time) + updateTxt}</div>
						</div>

						<div className="flex items-center gap-2 text-base">
							{isAcceptedQna && (
								<div className="text-xs text-gray-500 dark:text-gray-400">
									채택을 완료한 게시글은 수정·삭제할 수
									없습니다.
								</div>
							)}

							<IoEyeOutline />
							<div>{post.views}</div>

							<FaRegThumbsUp />
							<div>{post.likes}</div>

							{isAuthor && !isAcceptedQna ? (
								<>
									<Button
										size="small"
										onClick={handleUpdate}
										variant="text"
										color="neutral"
									>
										수정
									</Button>
									<Button
										size="small"
										onClick={deleteModal.open}
										variant="text"
										color="danger"
									>
										삭제
									</Button>
								</>
							) : null}
						</div>
					</div>
				</div>
			</div>

			<div className="flex flex-col">
				<div
					className="post-body h-full w-[780px] resize-none text-start text-base"
					dangerouslySetInnerHTML={{ __html: content }}
				/>

				<div className="mt-10 flex flex-col items-center justify-center">
					<div
						className={`flex flex-col items-center ${userLiked ? "text-green-500" : "text-gray-600 dark:text-gray-200"}`}
						onClick={handleLike}
					>
						<FaRegThumbsUp className="text-3xl" />
						<div className="text-xl">{likes}</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PostInfo;
