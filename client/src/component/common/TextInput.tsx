import clsx from "clsx";
import React from "react";
import {
	errorMessageWrapper,
	innerWrapper,
	invalidTextInput,
	labelErrorStyle,
	labelOkStyle,
	labelStyle,
	outerWrapper,
	textInputBase,
} from "./TextInput.temp.css";

interface ITextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	wrapperClassName?: string | undefined;
	type?: "email" | "number" | "password" | "search" | "tel" | "text" | "url";
	label?: string | undefined;
	isValid?: boolean | undefined;
	errorMessage?: string | undefined;
	actionButton?: React.ReactElement | undefined;
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
		<div className={clsx(outerWrapper, wrapperClassName)}>
			{label && (
				<label
					htmlFor={id}
					className={clsx(
						labelStyle,
						isValid === true && labelOkStyle,
						isValid === false && labelErrorStyle
					)}
				>
					{label}
				</label>
			)}

			<div className={innerWrapper}>
				<input
					{...inputProps}
					type={type}
					id={id}
					className={clsx(
						className,
						textInputBase,
						isValid === false && invalidTextInput
					)}
					onKeyDown={handleInputKeyDown}
				/>
				{actionButton}
			</div>

			{isValid === false && (
				<div className={errorMessageWrapper}>{errorMessage}</div>
			)}
		</div>
	);
};

export default TextInput;
