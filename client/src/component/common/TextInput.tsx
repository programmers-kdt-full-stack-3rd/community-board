import clsx from "clsx";
import React from "react";
import { invalid, textInputBase } from "./TextInput.temp.css";

interface ITextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	type?: "email" | "number" | "password" | "search" | "tel" | "text" | "url";
	isValid?: boolean;
}

const TextInput: React.FC<ITextInputProps> = ({
	className,
	type = "text",
	isValid = true,
	...inputProps
}) => {
	return (
		<input
			{...inputProps}
			type={type}
			className={clsx(className, textInputBase, isValid || invalid)}
		/>
	);
};

export default TextInput;
