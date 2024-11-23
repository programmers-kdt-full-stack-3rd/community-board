import React, { useEffect, useLayoutEffect, useRef } from "react";
import { twJoin } from "tailwind-merge";
import { useToast } from "../../../state/ToastStore";

interface IProps {
	id: number;
}

const TOAST_DURATION_MS = 3000;

const ToastItem: React.FC<IProps> = ({ id }) => {
	const toastBoxRef = useRef<HTMLDivElement>(null);
	const { items, updateItem, dismiss, forceRemove } = useToast();
	const item = items.map.get(id);

	const handleDismiss = () => {
		if (item?.phase !== "out") {
			dismiss(id);
		}
	};

	useLayoutEffect(() => {
		if (!toastBoxRef.current || !item) {
			return;
		}

		if (!item.elementHeight) {
			updateItem(id, {
				elementHeight:
					toastBoxRef.current.getBoundingClientRect().height,
			});
		}
	}, [id]);

	useEffect(() => {
		if (!toastBoxRef.current || !item) {
			return;
		}

		let timeoutId: number | null = null;
		let handleOutTransitionEnd: (() => void) | null = null;

		if (item.phase === "in") {
			updateItem(id, { phase: "alive" });
		} else if (item.phase === "alive") {
			timeoutId = window.setTimeout(() => {
				handleDismiss();
			}, TOAST_DURATION_MS);
		} else if (item.phase === "out") {
			handleOutTransitionEnd = () => {
				forceRemove(id);
			};

			toastBoxRef.current.addEventListener(
				"transitionend",
				handleOutTransitionEnd
			);
		}

		return () => {
			if (timeoutId !== null) {
				window.clearTimeout(timeoutId);
			}

			if (handleOutTransitionEnd) {
				toastBoxRef.current?.removeEventListener(
					"transitionend",
					handleOutTransitionEnd
				);
			}
		};
	}, [item?.phase]);

	// TODO: 다크모드 스타일 작성
	return (
		<div
			className="fixed left-1/2 top-20 z-50 w-full max-w-96 -translate-x-1/2 translate-y-0 transition-transform duration-300"
			style={{
				"--tw-translate-y": `${item?.elementOffsetY || 0}px`,
			}}
		>
			<div
				ref={toastBoxRef}
				onClick={handleDismiss}
				className={twJoin(
					"bg-customGray/85 flex w-full cursor-pointer gap-1 rounded px-4 py-3 text-sm text-white shadow-md backdrop-blur transition duration-300",
					item?.phase === "in" && "opacity-0",
					item?.phase === "out" && "-translate-y-6 opacity-0"
				)}
			>
				<div className="shrink-0 grow-0">
					{/* TODO: variant 디테일 작성 */}
					<b className="text-yellow-400">
						{String.fromCharCode(
							0x24d0 +
								(item?.variant[0].charCodeAt(0) || 0) -
								0x61
						)}
					</b>
				</div>

				<div className="flex-1">
					{item?.message}
					{/* TODO: 메시지만 남기기 */}
					<br />
					[id] {id}
					<br />
					[phase] {item?.phase}
					<br />
					[offsetY] {item?.elementOffsetY}
					<br />
					[height] {item?.elementHeight}
				</div>
			</div>
		</div>
	);
};

export default ToastItem;
