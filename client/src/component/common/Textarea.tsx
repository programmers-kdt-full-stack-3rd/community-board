import clsx from "clsx";
import React from "react";
import { invalid, textareaBase } from "./Textarea.temp.css";

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
			className={clsx(className, textareaBase, isValid || invalid)}
		/>
	);
};

export default Textarea;
