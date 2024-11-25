import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useToast } from "../../../state/ToastStore";
import ToastItem from "./ToastItem";

const TOAST_GAP = 8;

const container = document.getElementById("toast-root")!;

const Toast = () => {
	const { items, updateItem } = useToast();

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
