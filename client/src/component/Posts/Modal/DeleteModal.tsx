import { SetStateAction } from "react";
import { sendDeletePostRequest } from "../../../api/posts/crud";
import { useNavigate } from "react-router-dom";
import {
	Btns,
	CancleBtn,
	DeleteBtn,
	DeleteModalContainer,
	DeleteModalText,
} from "./DeleteModal.css";
import { ApiCall } from "../../../api/api";
import { ClientError } from "../../../api/errors";
import { useErrorModal } from "../../../state/errorModalStore";

interface IDeleteModalProps {
	close: React.Dispatch<SetStateAction<boolean>>;
	postId: number;
	isAuthor: boolean;
}

const DeleteModal: React.FC<IDeleteModalProps> = ({
	close,
	postId,
	isAuthor,
}) => {
	const navigate = useNavigate();
	const errorModal = useErrorModal();

	const handlePostDelete = async () => {
		// TODO : 메모제이션으로 최적화
		if (!isAuthor) {
			errorModal.setErrorMessage("error:삭제권한이 없습니다.");
			errorModal.open();
			return;
		}

		const res = await ApiCall(
			() => sendDeletePostRequest(postId.toString()),
			err => {
				errorModal.setErrorMessage(err.message);
				close(false);
				errorModal.open();
			}
		);

		if (res instanceof ClientError) {
			return;
		}

		close(false);
		alert("삭제에 성공했습니다.");
		navigate("/");
	};

	return (
		<div className={DeleteModalContainer}>
			<div className={DeleteModalText}>정말 게시글을 삭제하겠습니까?</div>
			<div className={Btns}>
				<button
					className={DeleteBtn}
					onClick={() => handlePostDelete()}
				>
					삭제
				</button>
				<button
					className={CancleBtn}
					onClick={() => close(false)}
				>
					취소
				</button>
			</div>
		</div>
	);
};

export default DeleteModal;
