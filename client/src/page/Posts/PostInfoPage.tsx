import { useEffect, useLayoutEffect } from "react";
import PostInfo from "../../component/Posts/PostInfo";
import { useNavigate, useParams } from "react-router-dom";
import Comments from "../../component/Comments/Comments";
import { useGlobalErrorModal } from "../../state/GlobalErrorModalStore";
import { usePostInfo } from "../../state/PostInfoStore";

const PostInfoPage = () => {
	const navigate = useNavigate();
	const { id: idParam } = useParams();

	const { postErrorMessage, postFetchState, fetchPost } = usePostInfo();
	const globalErrorModal = useGlobalErrorModal();

	useEffect(() => {
		const postId = parseInt(idParam ?? "", 10) || 0;
		fetchPost(postId);
	}, [idParam]);

	useLayoutEffect(() => {
		if (postFetchState === "error") {
			globalErrorModal.openWithMessageSplit({
				messageWithTitle: postErrorMessage,
				callback: () => navigate("/"),
			});
		}
	}, [postFetchState]);

	return (
		<div className="flex h-full w-full flex-col items-center">
			<PostInfo />
			<Comments />
		</div>
	);
};

export default PostInfoPage;
