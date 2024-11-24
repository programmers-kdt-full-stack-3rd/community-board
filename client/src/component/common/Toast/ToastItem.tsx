import React, { useEffect, useLayoutEffect, useRef } from "react";
import {
	FiAlertTriangle,
	FiCheckCircle,
	FiInfo,
	FiXCircle,
} from "react-icons/fi";
import { IconType } from "react-icons/lib";
import { twJoin, twMerge } from "tailwind-merge";
import { TToastVariant, useToast } from "../../../state/ToastStore";

interface IProps {
	id: number;
}

interface IToastClassNames {
	box: string;
	icon: string;
}

type TVariantProperties<T> = {
	[key in TToastVariant]: T;
};

const TOAST_DURATION_MS = 3000;

const variantClassNames: TVariantProperties<IToastClassNames> = {
	error: {
		box: "bg-red-200 dark:bg-red-900",
		icon: "text-red-900 dark:text-red-200",
	},
	warning: {
		box: "bg-yellow-200 dark:bg-yellow-900",
		icon: "text-yellow-900 dark:text-yellow-200",
	},
	success: {
		box: "bg-green-200 dark:bg-green-900",
		icon: "text-green-900 dark:text-green-200",
	},
	info: {
		box: "",
		icon: "text-neutral-800 dark:text-neutral-200",
	},
};

const IconComponents: TVariantProperties<IconType> = {
	error: FiXCircle,
	warning: FiAlertTriangle,
	success: FiCheckCircle,
	info: FiInfo,
};

const ToastItem: React.FC<IProps> = ({ id }) => {
	const toastBoxRef = useRef<HTMLDivElement>(null);
	const { items, updateItem, dismiss, forceRemove } = useToast();
	const item = items.map.get(id);

	const variant = item?.variant ?? "info";
	const Icon = IconComponents[variant];

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
				className={twMerge(
					"dark:bg-customGray flex w-full cursor-pointer gap-2 rounded border-l border-t border-white/5 bg-neutral-200 py-3 pl-3 pr-4 text-sm text-black shadow-md transition duration-300 dark:text-white",
					variantClassNames[variant].box,
					item?.phase === "in" && "opacity-0",
					item?.phase === "out" && "-translate-y-6 opacity-0"
				)}
			>
				<div className="shrink-0 grow-0">
					<Icon
						className={twJoin(
							"text-lg",
							variantClassNames[variant].icon
						)}
					/>
				</div>

				<div className="flex-1">{item?.message}</div>
			</div>
		</div>
	);
};

export default ToastItem;
