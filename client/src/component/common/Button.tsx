import clsx from "clsx";
import React from "react";
import {
	buttonBase,
	dangerBackground,
	dangerText,
	dangerOutline,
	largeSize,
	mediumSize,
	neutralBackground,
	neutralText,
	neutralOutline,
	primaryBackground,
	primaryText,
	primaryOutline,
	smallSize,
	actionBackground,
	actionText,
	actionOutline,
} from "./Button.temp.css";

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	color?: "primary" | "action" | "neutral" | "danger";
	variant?: "solid" | "outline" | "text";
	size?: "small" | "medium" | "large";
}

const Button: React.FC<IButtonProps> = ({
	children,
	className,
	color = "neutral",
	variant = "solid",
	size = "medium",
	...buttonProps
}) => {
	return (
		<button
			{...buttonProps}
			type={buttonProps.type || "button"}
			className={clsx(
				className,
				buttonBase,
				color === "primary" &&
					(variant === "solid"
						? [primaryBackground, primaryOutline]
						: variant === "outline"
							? [primaryOutline, primaryText]
							: primaryText),
				color === "neutral" &&
					(variant === "solid"
						? [neutralBackground, neutralOutline]
						: variant === "outline"
							? [neutralOutline, neutralText]
							: neutralText),
				color === "action" &&
					(variant === "solid"
						? [actionBackground, actionOutline]
						: variant === "outline"
							? [actionOutline, actionText]
							: actionText),
				color === "danger" &&
					(variant === "solid"
						? [dangerBackground, dangerOutline]
						: variant === "outline"
							? [dangerOutline, dangerText]
							: dangerText),
				size === "small"
					? smallSize
					: size === "medium"
						? mediumSize
						: largeSize
			)}
		>
			{children}
		</button>
	);
};

export default Button;
