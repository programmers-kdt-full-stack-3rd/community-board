import clsx from "clsx";
import React from "react";

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
			className={clsx(
				className,
				"m-0 box-border flex-1 resize-y rounded-md border bg-transparent p-2 text-base text-black",
				isValid ? "border-gray-500" : "border-red-500 bg-red-50"
			)}
		/>
	);
};

export default Textarea;
