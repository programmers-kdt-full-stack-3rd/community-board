import React, { useRef, useState } from "react";
import ReactQuill from "react-quill";
import TextInput from "../../component/common/TextInput";
import { useLocation, useNavigate } from "react-router-dom";
import CustomEditor from "../../component/Posts/Editer/CustomEditor";
import Button from "../../component/common/Button";
import { ApiCall } from "../../api/api";
import {
	sendCreatePostRequest,
	sendUpdatePostRequest,
} from "../../api/posts/crud";
import { ClientError } from "../../api/errors";
import { useGlobalErrorModal } from "../../state/GlobalErrorModalStore";
import ImageManager from "../../component/Posts/Editer/ImageManager";

const UpsertPostPage: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const postId = queryParams.get("postId") || "";
	const title = queryParams.get("title") || "";
	const content = queryParams.get("content") || "";

	const errorModal = useGlobalErrorModal();

	const [postTitle, setPostTitle] = useState<string>(title);
	const [postContent, setPostContent] = useState<string>(content);

	const quillRef = useRef<ReactQuill>(null);

	const createPost = async () => {
		const body = {
			title: postTitle,
			content: postContent,
			doFilter: false,
		};

		const res = await ApiCall(
			() => sendCreatePostRequest(body),
			err => {
				errorModal.openWithMessageSplit({
					messageWithTitle: err.message,
				});
			}
		);

		if (res instanceof ClientError) {
			return;
		}

		navigate(`/post/${res.postId}`);
	};

	const updatePost = async () => {
		if (!postId) {
			return;
		}

		const body = {
			title: postTitle,
			content: postContent,
			doFilter: false,
		};

		const res = await ApiCall(
			() => sendUpdatePostRequest(parseInt(postId), body),
			err => {
				errorModal.openWithMessageSplit({
					messageWithTitle: err.message,
				});
			}
		);

		if (res instanceof ClientError) {
			return;
		}

		navigate(`/post/${postId}`);
	};

	// Upsert : update + insert
	const handleUpsertPost = () => {
		if (postId) {
			updatePost();
		} else {
			createPost();
		}
	};

	// const handleUploadImage = () => {
	//     if (content) {
	//         //
	//     } else {

	//     }
	// };

	return (
		<div className="flex w-[860px] flex-col items-center justify-center gap-6 px-6 py-6 text-start">
			<TextInput
				wrapperClassName="w-full"
				label="제목"
				errorMessage="제목이 비었습니다."
				type="text"
				id="post-title"
				placeholder="제목을 입력하세요."
				value={postTitle}
				onChange={e => setPostTitle(e.target.value)}
			/>

			<div className="flex w-full flex-col gap-1">
				<div className="ml-1 text-sm font-bold text-blue-900">내용</div>
				<CustomEditor
					quillRef={quillRef}
					content={postContent}
					setContent={setPostContent}
				/>
			</div>

			<ImageManager
				quillRef={quillRef}
				editorContents={postContent}
			/>

			<div className="flex w-full items-end justify-end gap-4">
				<Button
					color="neutral"
					variant="outline"
					onClick={() => navigate(-1)}
				>
					취소
				</Button>

				<Button
					color="primary"
					onClick={handleUpsertPost}
				>
					작성 완료
				</Button>
			</div>
		</div>
	);
};

export default UpsertPostPage;
