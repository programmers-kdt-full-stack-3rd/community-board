import { PostHeader } from "./PostInfo.css";
import { dateToStr } from "../../utils/date-to-str";
import { IPostInfo } from "shared";
import { useLayoutEffect, useState } from "react";
import PostModal from "./Modal/PostModal";
import DeleteModal from "./Modal/DeleteModal";
import {
	sendCreatePostLikeRequest,
	sendDeletePostLikeRequest,
} from "../../api/likes/crud";
import { useUserStore } from "../../state/store";
import { ApiCall } from "../../api/api";
import { ClientError } from "../../api/errors";
import { useErrorModal } from "../../state/errorModalStore";
import Button from "../common/Button";
import { IoEyeOutline } from "react-icons/io5";
import { FaRegThumbsUp } from "react-icons/fa6";
interface IPostInfoProps {
	postInfo: IPostInfo;
}

const PostInfo: React.FC<IPostInfoProps> = ({ postInfo }) => {
	const [updateModalOpen, setUpdateModalOpen] = useState(false);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [userLiked, setUserLiked] = useState(false);
	const [likes, setLikes] = useState(0);
	const errorModal = useErrorModal();

	useLayoutEffect(() => {
		setUserLiked(postInfo.user_liked);
		setLikes(postInfo.likes);
	}, [postInfo]);

	const time = postInfo.updated_at
		? new Date(postInfo.updated_at)
		: new Date(postInfo.created_at);

	const updateTxt = postInfo.updated_at ? " (수정됨)" : "";

	const isAuthor = postInfo.is_author;

	const content = postInfo.content.split("\n").map((line, index) => (
		<span key={index}>
			{line}
			<br />
		</span>
	));

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
			err => {
				errorModal.setErrorMessage(err.message);
				errorModal.open();
			}
		);

		if (res instanceof ClientError) {
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

	return (
		<div>
			{updateModalOpen ? (
				<PostModal
					close={setUpdateModalOpen}
					originalPostData={postInfo}
				/>
			) : null}
			{deleteModalOpen ? (
				<DeleteModal
					close={setDeleteModalOpen}
					isAuthor={isAuthor}
					postId={postInfo.id}
				/>
			) : null}
			<div className={PostHeader}>
				<div className="bg-customGray relative mb-4 mt-4 flex flex-col justify-between rounded-lg text-left">
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
							<IoEyeOutline></IoEyeOutline>
							<div>{postInfo.views}</div>
							<FaRegThumbsUp></FaRegThumbsUp>
							<div>{postInfo.likes}</div>
							{isAuthor ? (
								<Button
									size="small"
									onClick={() => setUpdateModalOpen(true)}
									variant="text"
									color="neutral"
								>
									수정
								</Button>
							) : null}
							{isAuthor ? (
								<Button
									size="small"
									onClick={() => setDeleteModalOpen(true)}
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
				<div className="flex h-full w-[780px] resize-none flex-col text-start">
					{content}
				</div>
				<div
					className={`mt-10 flex flex-col items-center justify-center`}
				>
					<div
						className="flex flex-col items-center"
						onClick={handleLike}
					>
						<FaRegThumbsUp
							className={`text-3xl ${userLiked ? "text-green-500" : "text-gray-200"}`}
						/>
						<div
							className={`text-1xl ${userLiked ? "text-green-500" : "text-gray-200"}`}
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
