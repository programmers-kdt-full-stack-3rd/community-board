import clsx from "clsx";
import React from "react";

export type TButtonColor =
	| "primary"
	| "action"
	| "neutral"
	| "danger"
	| "disabled";
export type TButtonVariant = "solid" | "outline" | "text";
export type TButtonSize = "small" | "medium" | "large";

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	color?: TButtonColor;
	variant?: TButtonVariant;
	size?: TButtonSize;
}

const Button: React.FC<IButtonProps> = ({
	children,
	className,
	color = "neutral",
	variant = "solid",
	size = "medium",
	...buttonProps
}) => {
	const baseClass =
		"box-border m-0 border-0 rounded-md cursor-pointer transition duration-200 whitespace-nowrap";

	// 색은 나중에 수정
	const colorClass = {
		primary: {
			solid: "bg-blue-800 text-white hover:bg-blue-700",
			outline:
				"border border-blue-800 text-blue-800 hover:bg-blue-800 hover:text-white",
			text: "text-blue-800 hover:bg-blue-100",
		},
		neutral: {
			solid: "bg-blue-900 dark:bg-customGray text-white hover:bg-blue-800 dark:hover:bg-gray-600",
			outline:
				"border border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white",
			text: "text-gray-600 hover:bg-gray-100",
		},
		action: {
			solid: "bg-blue-500 text-white hover:bg-blue-400",
			outline:
				"border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white",
			text: "text-blue-500 hover:bg-blue-100",
		},
		danger: {
			solid: "bg-red-600 text-white hover:bg-red-500",
			outline:
				"border border-red-600 text-red-600 hover:bg-red-600 hover:text-white",
			text: "text-red-600 hover:bg-red-100",
		},
		disabled: {
			solid: "bg-gray-500 text-white hover:bg-gray-400",
			outline:
				"border border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white",
			text: "text-gray-600 hover:bg-gray-100",
		},
	};

	const sizeClass = {
		small: "py-1 px-3 text-sm leading-4",
		medium: "py-2 px-4 text-base leading-5",
		large: "py-3 px-6 text-lg leading-5",
	};

	return (
		<button
			{...buttonProps}
			type={buttonProps.type || "button"}
			className={clsx(
				baseClass,
				colorClass[color][variant],
				sizeClass[size],
				className
			)}
		>
			{children}
		</button>
	);
};

export default Button;
