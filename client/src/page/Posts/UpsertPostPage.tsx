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
import { useGlobalErrorModal } from "../../state/GlobalErrorModalStore";
import ImageManager from "../../component/Posts/Editer/ImageManager";
import { sanitizePostContent } from "../../utils/sanitizePostContent";

const UpsertPostPage: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const postId = queryParams.get("postId") || "";
	const originalTitle = queryParams.get("title") || "";
	const originalContent = queryParams.get("content") || "";

	const errorModal = useGlobalErrorModal();

	const [title, setTitle] = useState<string>(originalTitle);
	const [content, setContent] = useState<string>(originalContent);

	const quillRef = useRef<ReactQuill>(null);

	const [isTitleValid, setIsTitleValid] = useState<boolean | undefined>(
		originalTitle === "" ? undefined : true
	);

	const isContentValid = useMemo(() => {
		const delta = quillRef.current?.getEditor()?.getContents();

		if (!content || !delta?.ops?.length) {
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
	}, [quillRef.current, content]);

	const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;

		setIsTitleValid(!!value);
		setTitle(value);
	};

	const createPost = async () => {
		const body = {
			title,
			content: sanitizePostContent(content),
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

		if (res instanceof Error) {
			return;
		}

		navigate(`/post/${res.postId}`);
	};

	const updatePost = async () => {
		if (!postId) {
			return;
		}

		const body = {
			title,
			content: sanitizePostContent(content),
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

		if (res instanceof Error) {
			return;
		}

		navigate(`/post/${postId}`);
	};

	// Upsert : update + insert
	const handleUpsertPost = () => {
		if (!title.trim()) {
			setIsTitleValid(false);
			return;
		}

		if (isContentValid === undefined && !content) {
			// 내용을 비웠을 때와 동일한 내용을 입력하여 유효성 검사 재발동, 메시지 출력
			setContent("<p><br><p>");
			return;
		}

		if (postId && title === originalTitle && content === originalContent) {
			errorModal.open({
				title: "변경 내용 없음",
				message: "제목, 내용 중 어느 것도 변경하지 않았습니다.",
			});
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
				isValid={isTitleValid}
				errorMessage="제목이 비었습니다."
				type="text"
				id="post-title"
				placeholder="제목을 입력하세요."
				value={title}
				onChange={handleTitleChange}
			/>

			<div className="flex w-full flex-col gap-1">
				<div className="ml-1 flex gap-6 text-sm">
					<div
						className={clsx(
							"font-bold",
							isContentValid === undefined && "text-blue-900",
							isContentValid === true &&
								"text-blue-900 after:ml-1 after:content-['✔']",
							isContentValid === false &&
								"text-red-600 after:ml-1 after:content-['✘']"
						)}
					>
						내용
					</div>
					<div
						className={clsx(
							"text-red-600",
							isContentValid !== false && "hidden"
						)}
					>
						내용을 입력하세요.
					</div>
				</div>

				<CustomEditor
					quillRef={quillRef}
					content={content}
					setContent={setContent}
				/>
			</div>

			<ImageManager
				quillRef={quillRef}
				editorContents={content}
				setEditorContents={setContent}
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
