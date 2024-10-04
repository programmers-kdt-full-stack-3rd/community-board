import { SetStateAction } from "react";
import { ContentTextArea } from "../Modal/PostModal.css";

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
	// 이미지 업로드 -> S3에 저장 -> 저장된 이미지 url (imgUrl) 반환
	// const upload = async (file: Blob) => {
	// 	const res = await ApiCall(
	// 		() => uploadImageRequest(file),
	// 		err => {
	// 			errorModal.setErrorMessage(err.message);
	// 			errorModal.open();
	// 		}
	// 	);

	// 	if (res instanceof ClientError) {
	// 		return;
	// 	}

	// 	return res.imgUrl;
	// };

	return (
		<textarea
			className={ContentTextArea}
			value={content}
			onChange={e => setContent(e.target.value)}
			placeholder="내용을 입력해주세요"
		></textarea>
	);
};

export default CustomEditor;
