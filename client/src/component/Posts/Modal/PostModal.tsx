import { SetStateAction, useState } from "react";
import {
	ApplyBtn,
	CloseBtn,
	ContentTextArea,
	FilterBtn,
	InputContainer,
	InputIndex,
	ModalBody,
	ModalContainer,
	ModalHeader,
	PostBtn,
	PostHeaderTitle,
	TitleInput,
} from "./PostModal.css";
import {
	sendCreatePostRequest,
	sendUpdatePostRequest,
} from "../../../api/posts/crud";
import { ApiCall } from "../../../api/api";
import { ClientError } from "../../../api/errors";
import { useErrorModal } from "../../../state/errorModalStore";
import { useNavigate } from "react-router-dom";

interface IPostData {
	id: number;
	title: string;
	content: string;
}

interface IPostModalProps {
	close: React.Dispatch<SetStateAction<boolean>>;
	originalPostData?: IPostData;
}

const PostModal: React.FC<IPostModalProps> = ({ close, originalPostData }) => {
	const navigate = useNavigate();
	const isUpdateMode = originalPostData !== undefined;

	const modalMode = isUpdateMode ? "수정" : "생성";
	const errorModal = useErrorModal();

	const [title, setTitle] = useState(
		isUpdateMode ? originalPostData.title : ""
	);
	const [content, setContent] = useState(
		isUpdateMode ? originalPostData.content : ""
	);
	const [doFilter, setDoFilter] = useState(false);

	const createPost = async () => {
		const body = { title, content, doFilter };

		const res = await ApiCall(
			() => sendCreatePostRequest(body),
			err => {
				errorModal.setErrorMessage(err.message);
				errorModal.open();
			}
		);

		if (res instanceof ClientError) {
			return;
		}

		navigate(`/post/${res.postId}`);
	};

	const updatePost = async () => {
		if (!originalPostData) {
			return;
		}

		const body = {
			title,
			content,
			doFilter,
		};

		const postId: number = originalPostData.id;

		const res = await ApiCall(
			() => sendUpdatePostRequest(postId, body),
			err => {
				errorModal.setErrorMessage(err.message);
				errorModal.open();
			}
		);

		if (res instanceof ClientError) {
			return;
		}

		window.location.reload();
	};

	return (
		<div className={ModalContainer}>
			<div className={ModalHeader}>
				<button
					className={PostBtn}
					onClick={() => {
						if (isUpdateMode) {
							updatePost();
						} else {
							createPost();
						}
						close(false);
					}}
				>
					{modalMode}
				</button>
				<div className={PostHeaderTitle}>게시글 {modalMode}</div>
				<button
					className={CloseBtn}
					onClick={() => close(false)}
				>
					취소
				</button>
			</div>
			<div className={ModalBody}>
				<div className={InputContainer}>
					<div className={InputIndex}>제목</div>
					<input
						className={TitleInput}
						value={title}
						onChange={e => setTitle(e.target.value)}
						placeholder="제목을 입력해주세요"
					></input>
				</div>
				<div className={InputContainer}>
					<div className={InputIndex}>
						<div>내용</div>
						<button
							className={doFilter ? ApplyBtn : FilterBtn}
							onClick={() => setDoFilter(!doFilter)}
						>
							필터링 (beta)
						</button>
					</div>
					<textarea
						className={ContentTextArea}
						value={content}
						onChange={e => setContent(e.target.value)}
						placeholder="내용을 입력해주세요"
					></textarea>
				</div>
			</div>
		</div>
	);
};

export default PostModal;
