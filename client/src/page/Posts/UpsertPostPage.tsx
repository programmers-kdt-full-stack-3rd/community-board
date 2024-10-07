import clsx from "clsx";
import React, { ChangeEvent, useMemo, useRef, useState } from "react";
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
import { sanitizePostContent } from "../../utils/sanitizePostContent";

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

	const [isPostTitleValid, setIsPostTitleValid] = useState<
		boolean | undefined
	>(undefined);

	const isPostContentValid = useMemo(() => {
		const delta = quillRef.current?.getEditor()?.getContents();

		if (!postContent || !delta?.ops?.length) {
			return undefined;
		}

		for (const op of delta.ops) {
			if (op.insert?.constructor !== String) {
				return true;
			} else if (op.insert.trim()) {
				return true;
			}
		}

		return false;
	}, [quillRef.current, postContent]);

	const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;

		setIsPostTitleValid(!!value);
		setPostTitle(value);
	};

	const createPost = async () => {
		const body = {
			title: postTitle,
			content: sanitizePostContent(postContent),
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
			content: sanitizePostContent(postContent),
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
		if (!postTitle.trim()) {
			setIsPostTitleValid(false);
			return;
		}

		if (!isPostContentValid) {
			// 내용을 비웠을 때와 동일한 내용을 입력하여 유효성 검사 재발동, 메시지 출력
			setPostContent("<p><br><p>");
			return;
		}

		if (postId) {
			updatePost();
		} else {
			createPost();
		}
	};

	return (
		<div className="flex w-[860px] flex-col items-center justify-center gap-6 px-6 py-6 text-start">
			<TextInput
				wrapperClassName="w-full"
				label="제목"
				isValid={isPostTitleValid}
				errorMessage="제목이 비었습니다."
				type="text"
				id="post-title"
				placeholder="제목을 입력하세요."
				value={postTitle}
				onChange={handleTitleChange}
			/>

			<div className="flex w-full flex-col gap-1">
				<div className="ml-1 flex gap-6 text-sm">
					<div
						className={clsx(
							"font-bold",
							isPostContentValid === undefined && "text-blue-900",
							isPostContentValid === true &&
								"text-blue-900 after:ml-1 after:content-['✔']",
							isPostContentValid === false &&
								"text-red-600 after:ml-1 after:content-['✘']"
						)}
					>
						내용
					</div>
					<div
						className={clsx(
							"text-red-600",
							isPostContentValid !== false && "hidden"
						)}
					>
						내용을 입력하세요.
					</div>
				</div>

				<CustomEditor
					quillRef={quillRef}
					content={postContent}
					setContent={setPostContent}
				/>
			</div>

			<ImageManager
				quillRef={quillRef}
				editorContents={postContent}
				setEditorContents={setPostContent}
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
