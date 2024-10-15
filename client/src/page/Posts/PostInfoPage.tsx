import { useLayoutEffect, useState } from "react";
import PostInfo from "../../component/Posts/PostInfo";
import { useNavigate, useParams } from "react-router-dom";
import { IPostInfo, mapDBToPostInfo } from "shared";
import { sendGetPostRequest } from "../../api/posts/crud";
import Comments from "../../component/Comments/Comments";
import { ApiCall } from "../../api/api";
import { ClientError } from "../../api/errors";
import { useGlobalErrorModal } from "../../state/GlobalErrorModalStore";

const PostInfoPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const globalErrorModal = useGlobalErrorModal();

	const [postInfo, setPostInfo] = useState<IPostInfo>({
		id: 0,
		title: "",
		content: "",
		category: "",
		author_id: 0,
		author_nickname: "",
		is_author: false,
		created_at: new Date(),
		updated_at: undefined,
		views: 0,
		likes: 0,
		user_liked: false,
		category: "",
	});

	useLayoutEffect(() => {
		if (!id) {
			{
				/* TODO : 에러 핸들링하기 */
			}
			return;
		}

		ApiCall(
			() => sendGetPostRequest(id),
			err => {
				globalErrorModal.openWithMessageSplit({
					messageWithTitle: err.message,
					callback: () => navigate("/category/community"),
				});
			}
		).then(res => {
			if (res instanceof ClientError) {
				return;
			}

			setPostInfo(mapDBToPostInfo(res.post));
		});
	}, []);

	return (
		<div className="flex h-full w-full flex-col items-center">
			<PostInfo postInfo={postInfo} />
			<Comments postId={postInfo.id || parseInt(id ?? "0", 10) || 0} />
		</div>
	);
};

export default PostInfoPage;
