import React from "react";
import { twMerge } from "tailwind-merge";

interface ITextareaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	isValid?: boolean;
}

const Textarea: React.FC<ITextareaProps> = ({
	className,
	isValid = true,
	...textareaProps
}) => {
	return (
		<textarea
			{...textareaProps}
			className={twMerge(
				className,
				"m-0 box-border flex-1 resize-y rounded-md border bg-transparent p-2 text-base text-black dark:text-gray-200",
				isValid ? "border-gray-500" : "border-red-500 bg-red-50"
			)}
		/>
	);
};

export default Textarea;
