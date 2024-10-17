import React from "react";
import { twMerge } from "tailwind-merge";

interface ITextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	wrapperClassName?: string;
	type?: "email" | "number" | "password" | "search" | "tel" | "text" | "url";
	label?: string;
	isValid?: boolean;
	errorMessage?: string;
	actionButton?: React.ReactElement;
}

const TextInput: React.FC<ITextInputProps> = ({
	className,
	wrapperClassName,
	label,
	isValid,
	errorMessage,
	actionButton,
	type = "text",
	id,
	onKeyDown,
	...inputProps
}) => {
	const handleInputKeyDown = (
		event: React.KeyboardEvent<HTMLInputElement>
	) => {
		if (onKeyDown) {
			onKeyDown(event);
		}

		const hasOnClick = typeof actionButton?.props?.onClick === "function";
		if (hasOnClick && event.key === "Enter") {
			event.preventDefault();
			actionButton.props.onClick();
		}
	};

	return (
		<div
			className={twMerge(
				"flex flex-col gap-1 text-left",
				wrapperClassName
			)}
		>
			{label && (
				<label
					htmlFor={id}
					className={twMerge(
						"ml-1 block text-sm font-bold",
						isValid === true && "after:ml-1 after:content-['✔']",
						isValid === false &&
							"text-red-600 after:ml-1 after:content-['✘']"
					)}
				>
					{label}
				</label>
			)}

			<div className="flex flex-1 gap-4">
				<input
					{...inputProps}
					type={type}
					id={id}
					className={twMerge(
						"m-0 box-border h-10 flex-1 rounded-md border border-gray-600 bg-transparent p-2 text-base text-inherit",
						isValid === false && "border-red-600 bg-red-50"
					)}
					onKeyDown={handleInputKeyDown}
				/>
				{actionButton}
			</div>

			{isValid === false && (
				<div className="ml-1 text-sm text-red-600">{errorMessage}</div>
			)}
		</div>
	);
};

export default TextInput;
