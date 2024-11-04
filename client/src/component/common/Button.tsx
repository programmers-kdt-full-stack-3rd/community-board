import React from "react";
import { twMerge } from "tailwind-merge";

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
	noInternalStyle?: boolean;
}

const Button: React.FC<IButtonProps> = ({
	children,
	className,
	color = "neutral",
	variant = "solid",
	size = "medium",
	noInternalStyle = false,
	...buttonProps
}) => {
	const baseClass =
		"box-border m-0 border-0 rounded-md cursor-pointer transition duration-200 whitespace-nowrap";

	// TODO: 색은 나중에 수정
	const colorClass = {
		primary: {
			solid: "bg-blue-800 text-white hover:bg-blue-700",
			outline:
				"border border-blue-800 text-blue-800 hover:bg-blue-600/20 hover:text-white",
			text: "text-blue-800 hover:bg-blue-600/20",
		},
		neutral: {
			solid: "bg-blue-900 dark:bg-customGray text-white hover:bg-blue-800 dark:hover:bg-gray-600",
			outline:
				"border border-gray-600 text-gray-600 hover:bg-gray-400/20 hover:text-white",
			text: "text-gray-600 hover:bg-gray-400/20",
		},
		action: {
			solid: "bg-blue-500 text-white hover:bg-blue-400",
			outline:
				"border border-blue-500 text-blue-500 hover:bg-blue-400/20 hover:text-white",
			text: "text-blue-500 hover:bg-blue-400/20",
		},
		danger: {
			solid: "bg-red-600 text-white hover:bg-red-500",
			outline:
				"border border-red-600 text-red-600 hover:bg-red-400/20 hover:text-white",
			text: "text-red-600 hover:bg-red-400/20",
		},
		disabled: {
			solid: "bg-gray-500 text-white hover:bg-gray-400",
			outline:
				"border border-gray-600 text-gray-600 hover:bg-gray-400/20 hover:text-white",
			text: "text-gray-600 hover:bg-gray-400/20",
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
			className={
				noInternalStyle
					? className
					: twMerge(
							baseClass,
							colorClass[color][variant],
							sizeClass[size],
							className
						)
			}
		>
			{children}
		</button>
	);
};

export default Button;
