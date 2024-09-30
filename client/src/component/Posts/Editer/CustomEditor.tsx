import {
	ContentState,
	convertFromHTML,
	convertToRaw,
	EditorState,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import { SetStateAction, useMemo, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { container } from "./CustomEditor.css";
import { ApiCall } from "../../../api/api";
import { useErrorModal } from "../../../state/errorModalStore";
import { uploadImageRequest } from "../../../api/posts/crud";
import { ClientError } from "../../../api/errors";
/*
client
- html tag 추가, 수정, 삭제 가능
- 서버에 업로드 시, html tag array -> string으로 변환
- string -> html로 만들어서 관리하기

server
- string만 관리하니까 크게 안바뀜
- image는 업로드 시, 미리 서버에 저장 + 저장된 주소를 client에서 사용함
*/

interface Props {
	content: string;
	setContent: React.Dispatch<SetStateAction<string>>;
}

const CustomEditor: React.FC<Props> = ({ content, setContent }) => {
	const errorModal = useErrorModal();

	const contentState = useMemo(() => {
		const convertedContent = convertFromHTML(
			// <ins>태그가 편집기에서 게시글 수정 상황일 때 제대로 적용이 안되서 추가함
			content.replace("<ins>", "<u>").replace("</ins>", "</u>")
		);

		return ContentState.createFromBlockArray(
			convertedContent.contentBlocks,
			convertedContent.entityMap
		);
	}, [content]);

	const [editorState, setEditorState] = useState(
		EditorState.createWithContent(contentState)
	);

	const handleEditorStateChange = (editorState: EditorState) => {
		setEditorState(editorState);
		setContent(draftToHtml(convertToRaw(editorState.getCurrentContent())));
	};

	// const [images, setImages] = useState<string[]>([]);
	const uploadCallback = async (file: Blob) => {
		const res = await ApiCall(
			() => uploadImageRequest(file),
			err => {
				errorModal.setErrorMessage(err.message);
				errorModal.open();
			}
		);

		if (res instanceof ClientError) {
			return;
		}

		return res.imgUrl;
	};

	return (
		<div
			className={container}
			onClick={() => {}}
		>
			<Editor
				editorState={editorState}
				onEditorStateChange={handleEditorStateChange}
				placeholder={"내용을 작성해주세요."}
				localization={{
					locale: "ko",
				}}
				editorStyle={{
					height: "400px",
					width: "100%",
					border: "3px solid lightgray",
					paddingLeft: "10px",
					paddingRight: "10px",
					backgroundColor: "white",
				}}
				toolbar={{
					image: { uploadCallback: uploadCallback },
				}}
			/>
		</div>
	);
};

export default CustomEditor;
