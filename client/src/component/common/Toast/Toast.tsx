import { useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { TToastVariant, useToast } from "../../../state/ToastStore";
import ToastItem from "./ToastItem";

const TOAST_GAP = 8;

const container = document.getElementById("toast-root")!;

// TODO: mock data 제거
const mockData: {
	message: string;
	variant: TToastVariant;
}[] = [
	{
		message: "단순 정보를 전달하는 토스트 (1)",
		variant: "info",
	},
	{
		message: "성공을 안내하는 토스트 (2)",
		variant: "success",
	},
	{
		message: "경고 토스트 (3)",
		variant: "warning",
	},
	{
		message: "에러 안내 토스트 (4)",
		variant: "error",
	},
];

const Toast = () => {
	const { items, add, updateItem, forceRemove } = useToast();

	// TODO: mock data 제거
	useLayoutEffect(() => {
		for (const item of mockData) {
			add(item);
		}

		return () => {
			items.map.forEach((_, key) => {
				forceRemove(key);
			});
		};
	}, []);

	useEffect(() => {
		const reversedItems = Array.from(items.map.values()).reverse();
		let offsetAcc = 0;

		for (const {
			id,
			phase,
			elementHeight,
			elementOffsetY,
		} of reversedItems) {
			if (elementOffsetY !== offsetAcc) {
				updateItem(id, { elementOffsetY: offsetAcc });
			}

			if (phase !== "out" && elementHeight) {
				offsetAcc += elementHeight + TOAST_GAP;
			}
		}
	}, [items]);

	return createPortal(
		<div className="fixed left-0 top-0 z-50 h-0 w-0">
			{Array.from(items.map.values(), ({ id }) => (
				<ToastItem
					key={id}
					id={id}
				/>
			))}
		</div>,
		container
	);
};

export default Toast;
