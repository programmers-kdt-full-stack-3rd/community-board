import React, { useRef, useState } from "react";
import ReactQuill from "react-quill";
import TextInput from "../../component/common/TextInput";
import { useLocation, useNavigate } from "react-router-dom";
import {
	InputContainer,
	InputIndex,
} from "../../component/Posts/Modal/PostModal.css";
import CustomEditor from "../../component/Posts/Editer/CustomEditor";
import Button from "../../component/common/Button";
import { ApiCall } from "../../api/api";
import {
	sendCreatePostRequest,
	sendUpdatePostRequest,
} from "../../api/posts/crud";
import { ClientError } from "../../api/errors";
import { useGlobalErrorModal } from "../../state/GlobalErrorModalStore";

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
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				width: "100%",
				paddingLeft: "50px",
				paddingRight: "50px",
				paddingTop: "10px",
				paddingBottom: "10px",
			}}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					width: "100%",
					paddingLeft: "50px",
					paddingRight: "50px",
					paddingTop: "30px",
					paddingBottom: "30px",
					border: "1px solid #ccc",
					gap: "20px",
				}}
			>
				<div className={InputContainer}>
					<div className={InputIndex}>제목</div>
					<TextInput
						placeholder="제목을 입력해주세요"
						value={postTitle}
						onChange={e => setPostTitle(e.target.value)}
					/>
				</div>
				<div className={InputContainer}>
					<div className={InputIndex}>내용</div>
					<CustomEditor
						quillRef={quillRef}
						content={postContent}
						setContent={setPostContent}
					/>
				</div>
				<div>
					<Button
						onClick={() => {
							navigate(-1);
						}}
					>
						취소
					</Button>
					<Button onClick={handleUpsertPost}>쓰기</Button>
				</div>
			</div>
		</div>
	);
};

export default UpsertPostPage;
