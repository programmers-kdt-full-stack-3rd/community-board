import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import Button from "../../common/Button";

interface IProps {
	quillRef: React.RefObject<ReactQuill>;
	editorContents: string;
}

const ImageManager: React.FC<IProps> = ({ quillRef, editorContents }) => {
	const [imageUrlSet, setImageUrlSet] = useState(new Set<string>());

	// useMemo로 첫 렌더부터 이미지 목록을 만들면
	// Quill 초기화 타이밍과 엇나가면서 이미지 목록을 못 만들 때가 있어서
	// 일부러 useEffect + state로 한 타이밍 늦게 이미지 목록 생성
	useEffect(() => {
		// TODO: 정렬: 업로드순, 타임스탬프를 제외한 파일명순 (현재는 본문 순서대로 표시)
		const delta = quillRef.current?.editor?.getContents();
		const nextImageUrlSet = new Set<string>();

		for (const op of delta?.ops ?? []) {
			if (op.insert?.image) {
				// TODO: S3 URL인지 검사하여 필터
				nextImageUrlSet.add(op.insert.image);
			}
		}

		setImageUrlSet(nextImageUrlSet);
	}, [quillRef.current, editorContents]);

	return (
		<div className="text-start">
			<div>첨부한 이미지</div>

			<div>
				{Array.from(imageUrlSet, url => (
					<div key={url}>
						<img src={url} />
						<Button>삭제</Button>
					</div>
				))}
			</div>
		</div>
	);
};

export default ImageManager;
