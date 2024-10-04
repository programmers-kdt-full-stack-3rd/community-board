import React, { useEffect, useState } from "react";
import { FiImage, FiTrash2 } from "react-icons/fi";
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

	// TODO: 이미지 삭제 API 호출
	const handleDeleteWith = (url: string) => () => {
		alert(`이미지 삭제: ${url}`);
	};

	return (
		<div className="flex w-full flex-col gap-2 text-start">
			<div className="ml-1 text-sm font-bold text-blue-900">
				첨부한 이미지
			</div>

			<div className="grid grid-cols-6 gap-4 rounded-md border border-gray-600 p-4">
				{imageUrlSet.size === 0 ? (
					<div className="col-span-full flex items-center justify-center gap-2 p-8 text-center text-xl font-medium opacity-30">
						<FiImage />
						<div>첨부한 이미지가 없습니다.</div>
					</div>
				) : (
					Array.from(imageUrlSet, url => (
						<div
							key={url}
							className="relative overflow-hidden rounded-md"
						>
							<img
								src={url}
								className="aspect-square w-auto object-cover"
							/>
							<Button
								size="small"
								variant="text"
								onClick={handleDeleteWith(url)}
								className="absolute right-2 top-2 bg-white/65 p-2 shadow backdrop-blur-sm"
								// TODO: className 충돌로 인하여 Tailwind Merge 도입 필요
								style={{ padding: "8px" }}
							>
								<FiTrash2 />
							</Button>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default ImageManager;
