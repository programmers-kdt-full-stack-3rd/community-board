import React, { useEffect, useState } from "react";
import { FiImage, FiTrash2 } from "react-icons/fi";
import ReactQuill from "react-quill";
import { useModal } from "../../../hook/useModal";
import { useGlobalErrorModal } from "../../../state/GlobalErrorModalStore";
import Button from "../../common/Button";
import AlertModal from "../../common/Modal/AlertModal";
import ConfirmModal from "../../common/Modal/ConfirmModal";

interface IProps {
	quillRef: React.RefObject<ReactQuill>;
	editorContents: string;
	setEditorContents: React.Dispatch<React.SetStateAction<string>>;
}

const s3ImageUrlPattern =
	/^https:\/\/codeplay-bucket\.s3\.([a-z0-9_-]+)\.amazonaws\.com\/(.+)$/gi;

const isS3Image = (url: string): boolean => {
	return s3ImageUrlPattern.test(url);
};

const ImageManager: React.FC<IProps> = ({
	quillRef,
	editorContents,
	setEditorContents,
}) => {
	const globalErrorModal = useGlobalErrorModal();
	const removalConfirmModal = useModal();
	const removalSuccessModal = useModal();

	const [imageUrlSet, setImageUrlSet] = useState(new Set<string>());
	const [removalTargetUrl, setRemovalTargetUrl] = useState("");

	// useMemo로 첫 렌더부터 이미지 목록을 만들면
	// Quill 초기화 타이밍과 엇나가면서 이미지 목록을 못 만들 때가 있어서
	// 일부러 useEffect + state로 한 타이밍 늦게 이미지 목록 생성
	useEffect(() => {
		// TODO: 정렬 방법 추가: 업로드순 (현재는 본문 순서대로 표시)
		const delta = quillRef.current?.editor?.getContents();
		const nextImageUrlSet = new Set<string>();

		for (const op of delta?.ops ?? []) {
			const url = String(op.insert?.image ?? "");

			if (isS3Image(url)) {
				nextImageUrlSet.add(url);
			}
		}

		setImageUrlSet(nextImageUrlSet);
	}, [quillRef.current, editorContents]);

	const handleRemoveWith = (url: string) => () => {
		setRemovalTargetUrl(url);
		removalConfirmModal.open();
	};

	const handleRemovalAccept = () => {
		removalConfirmModal.close();

		const html = quillRef.current?.getEditorContents();

		if (!removalTargetUrl || typeof html !== "string") {
			globalErrorModal.open({
				title: "오류",
				message: "이미지를 제거하지 못했습니다.",
			});
			return;
		}

		const container = document.createElement("div");
		container.innerHTML = html;

		const nodes = container.querySelectorAll(
			`img[src="${removalTargetUrl}"]`
		);

		if (!nodes.length) {
			return;
		}

		for (const node of nodes) {
			node.remove();
		}

		setEditorContents(container.innerHTML);
		setRemovalTargetUrl("");
		removalSuccessModal.open();
	};

	return (
		<div className="flex w-full flex-col gap-2 text-start">
			<ConfirmModal
				isOpen={removalConfirmModal.isOpen}
				onAccept={handleRemovalAccept}
				onClose={removalConfirmModal.close}
				variant="warning"
				okButtonColor="danger"
				okButtonLabel="제거"
			>
				<ConfirmModal.Title>이미지 제거 확인</ConfirmModal.Title>
				<ConfirmModal.Body>
					<p>첨부한 이미지를 본문에서 제거할까요?</p>
					<img
						src={removalTargetUrl}
						className="mt-2 max-h-96 w-full object-contain"
					/>
				</ConfirmModal.Body>
			</ConfirmModal>

			<AlertModal
				isOpen={removalSuccessModal.isOpen}
				onClose={removalSuccessModal.close}
				variant="info"
			>
				<AlertModal.Title>안내</AlertModal.Title>
				<AlertModal.Body>
					이미지를 본문에서 제거했습니다.
				</AlertModal.Body>
			</AlertModal>

			<div className="ml-1 text-sm font-bold">첨부한 이미지</div>

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
								onClick={handleRemoveWith(url)}
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
