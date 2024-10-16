import clsx from "clsx";
import React, {
	ChangeEvent,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
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
import useCategory from "../../hook/useCategory";

const UpsertPostPage: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const categoryId =
		parseInt(queryParams.get("category_id") ?? "", 10) || undefined;
	const roomId = parseInt(queryParams.get("room_id") ?? "", 10) || undefined;
	const postId = queryParams.get("postId") || "";
	const originalTitle = queryParams.get("title") || "";
	const originalContent = queryParams.get("content") || "";
	const isModification = postId;

	const errorModal = useGlobalErrorModal();
	const { currentCategory } = useCategory(categoryId);

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

	useEffect(() => {
		if (!isModification && categoryId === null) {
			errorModal.open({
				title: "오류",
				message: "게시글을 작성할 카테고리 정보가 없습니다.",
				callback: () => navigate("/"),
			});
		}
	}, [isModification, categoryId]);

	const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;

		setIsTitleValid(!!value);
		setTitle(value);
	};

	const createPost = async () => {
		if (isModification) {
			return;
		}

		const body = {
			category_id: categoryId,
			title,
			content: sanitizePostContent(content),
			doFilter: false,
			room_id: roomId,
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
		if (!isModification) {
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
		let hasInvalid = false;

		if (!title.trim()) {
			setIsTitleValid(false);
			hasInvalid = true;
		}

		if (isContentValid === undefined && !content) {
			// 내용을 비웠을 때와 동일한 내용을 입력하여 유효성 검사 재발동, 메시지 출력
			setContent("<p><br><p>");
			hasInvalid = true;
		}

		if (
			isModification &&
			title === originalTitle &&
			content === originalContent
		) {
			errorModal.open({
				title: "변경 내용 없음",
				message: "제목, 내용 중 어느 것도 변경하지 않았습니다.",
			});
			hasInvalid = true;
		}

		if (hasInvalid) {
			window.scrollTo({ top: 0 });
			return;
		}

		if (isModification) {
			updatePost();
		} else {
			createPost();
		}
	};

	return (
		<div className="flex w-[860px] flex-col items-center justify-center gap-6 px-6 py-6 text-start">
			<div className="dark:bg-customGray relative flex w-full flex-col justify-between rounded-lg bg-blue-900 text-left">
				<span className="ml-5 mt-5 text-lg font-bold text-white">
					{isModification ? "게시글 수정" : "새 글 쓰기"}
				</span>

				<span className="mb-5 ml-5 mt-1 text-sm text-gray-200">
					{currentCategory
						? `“${currentCategory.name}”에 새 게시글을 작성합니다.`
						: `“${originalTitle}” 게시글을 수정합니다.`}
				</span>
			</div>

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
							isContentValid === true &&
								"after:ml-1 after:content-['✔']",
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
