import { ImageActions } from "@xeger/quill-image-actions";
import React, { SetStateAction, useCallback, useMemo } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ApiCall } from "../../../api/api";
import { uploadImageRequest } from "../../../api/posts/crud";
import { useGlobalErrorModal } from "../../../state/GlobalErrorModalStore";
import { getImageDimensionsFromBlob } from "../../../utils/getImageDimensions";
import { toolbarColors } from "./toolbarColors";

/*
client
- html tag 추가, 수정, 삭제 가능
- 서버에 업로드 시, html tag array -> string으로 변환
- string -> html로 만들어서 관리하기

server
- string만 관리하니까 크게 안바뀜
- image는 업로드 시, 미리 서버에 저장 + 저장된 주소를 client에서 사용함
*/

interface IProps {
	quillRef: React.RefObject<ReactQuill>;
	content: string;
	setContent: React.Dispatch<SetStateAction<string>>;
}

// 다크모드 호환을 위해 인라인 스타일 대신 클래스로 컬러 적용
const ColorClass = Quill.import("attributors/class/color");
Quill.register(ColorClass, true);

// 이미지 리사이징 확장 등록
Quill.register("modules/imageActions", ImageActions);

const CustomEditorBase: React.FC<IProps> = ({
	quillRef,
	content,
	setContent,
}) => {
	const globalErrorModal = useGlobalErrorModal();

	// 이미지 업로드 -> S3에 저장 -> 저장된 이미지 url (imgUrl) 반환
	const upload = useCallback(
		async (file: Blob) => {
			const res = await ApiCall(
				() => uploadImageRequest(file),
				err =>
					globalErrorModal.openWithMessageSplit({
						messageWithTitle: err.message,
					})
			);

			if (res instanceof Error) {
				return;
			}

			return res.imgUrl as string;
		},
		[globalErrorModal.openWithMessageSplit]
	);

	const handleImageUpload = useCallback(() => {
		const inputElement = document.createElement("input");
		inputElement.type = "file";
		inputElement.accept = "image/*";
		inputElement.name = "image";
		inputElement.click();

		inputElement.onchange = async () => {
			const file = inputElement.files && inputElement.files[0];

			if (!file) {
				return;
			}

			const url = await upload(file);

			if (!url) {
				return;
			}

			const { width, height } = await getImageDimensionsFromBlob(file);

			const quill = quillRef.current?.getEditor();
			const selectionIndex =
				quill?.getSelection()?.index ?? quill?.getLength() ?? 0;

			quill?.setSelection(selectionIndex, 0);
			quill?.clipboard.dangerouslyPasteHTML(
				selectionIndex,
				`<img src="${url}" width="${width}" height="${height}">`
			);
		};
	}, [upload, quillRef]);

	const quillFormats = useMemo(
		() => [
			"font",
			"size",
			"bold",
			"underline",
			"color",
			"code-block",
			"image",
			"width",
			"height",
		],
		[]
	);

	const quillModules = useMemo(
		() => ({
			toolbar: {
				container: [
					[{ font: [] }],
					[{ size: ["small", false, "large", "huge"] }],
					["bold", "underline", { color: toolbarColors }],
					["code-block"],
					["image"],
					["clean"],
				],
				handlers: {
					image: handleImageUpload,
				},
			},

			imageActions: {},
		}),
		[handleImageUpload]
	);

	return (
		<ReactQuill
			ref={quillRef}
			formats={quillFormats}
			modules={quillModules}
			value={content}
			onChange={setContent}
			theme="snow"
			className="mb-11 h-[calc(100vh-320px)]"
		/>
	);
};

const CustomEditor = React.memo(CustomEditorBase);

export default CustomEditor;
