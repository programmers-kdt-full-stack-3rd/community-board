import { dateToStr } from "../../utils/date-to-str";
import { IPostInfo } from "shared";
import { useCallback, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostModal from "./Modal/PostModal";
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

interface IPostInfoProps {
	postInfo: IPostInfo;
}

const PostInfo: React.FC<IPostInfoProps> = ({ postInfo }) => {
	const navigate = useNavigate();

	const updateModal = useModal();
	const deleteModal = useModal();
	const globalErrorModal = useGlobalErrorModal();

	const [userLiked, setUserLiked] = useState(false);
	const [likes, setLikes] = useState(0);

	useLayoutEffect(() => {
		setUserLiked(postInfo.user_liked);
		setLikes(postInfo.likes);
	}, [postInfo.user_liked, postInfo.likes]);

	const time = postInfo.updated_at
		? new Date(postInfo.updated_at)
		: new Date(postInfo.created_at);

	const updateTxt = postInfo.updated_at ? " (수정됨)" : "";

	const isAuthor = postInfo.is_author;

	const content = postInfo.content;

	const isLogin = useUserStore(state => state.isLogin);

	const handleLike = async () => {
		if (!isLogin) {
			alert("로그인이 필요합니다!");
			return;
		}

		const res = await ApiCall(
			userLiked
				? () => sendDeletePostLikeRequest(postInfo.id)
				: () => sendCreatePostLikeRequest(postInfo.id),
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

	const handlePostDelete = useCallback(async () => {
		if (!isAuthor) {
			globalErrorModal.open({
				title: "오류",
				message: "삭제 권한이 없습니다.",
			});
			return;
		}

		const res = await ApiCall(
			() => sendDeletePostRequest(postInfo.id.toString()),
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
		navigate("/category/community");
	}, [isAuthor]);

	return (
		<div>
			{/* 모달 부분 css 수정 x*/}
			{updateModal.isOpen ? (
				<PostModal
					close={() => updateModal.close()}
					originalPostData={postInfo}
				/>
			) : null}

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
						자유게시판
					</span>
				</div>

				<div className="border-b-customGray border-t-customGray border-spacing-3 border-y">
					<div className="text-left text-2xl font-bold">
						<div className="mb-2 mt-4">{postInfo.title}</div>
					</div>
					<div className="mb-4 flex items-center justify-between">
						<div className="flex items-center gap-2 text-lg">
							<div>{postInfo.author_nickname}</div>
							<div>{dateToStr(time) + updateTxt}</div>
						</div>
						<div className="flex items-center gap-2 text-base">
							<IoEyeOutline />
							<div>{postInfo.views}</div>
							<FaRegThumbsUp />
							<div>{postInfo.likes}</div>
							{isAuthor ? (
								<Button
									size="small"
									onClick={() => {
										navigate(
											`/post/new?postId=${postInfo.id}&title=${encodeURIComponent(postInfo.title)}&content=${encodeURIComponent(postInfo.content)}`
										);
									}}
									variant="text"
									color="neutral"
								>
									수정
								</Button>
							) : null}
							{isAuthor ? (
								<Button
									size="small"
									onClick={deleteModal.open}
									variant="text"
									color="danger"
								>
									삭제
								</Button>
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
				<div
					className={`mt-10 flex flex-col items-center justify-center`}
				>
					<div
						className="flex flex-col items-center"
						onClick={handleLike}
					>
						<FaRegThumbsUp
							className={`text-3xl ${userLiked ? "text-green-500" : "text-gray-600 dark:text-gray-200"}`}
						/>
						<div
							className={`text-1xl ${userLiked ? "text-green-500" : "text-gray-600 dark:text-gray-200"}`}
						>
							{likes}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PostInfo;
