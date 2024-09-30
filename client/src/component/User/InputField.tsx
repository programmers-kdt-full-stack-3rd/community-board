import { FC, InputHTMLAttributes } from "react";
import {
	checkedLabel,
	input,
	inputBox,
	inputWithBtn,
	invalidInput,
	label,
} from "./css/InputField.css";
import clsx from "clsx";
import DuplicationCheckButton from "./DuplicationCheckButton";

interface IInputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
	labelText: string;
	id: string;
	isValid?: boolean;
	isError?: boolean;
	duplicateCheck?: boolean;
	checkFunc?: () => void;
}

const InputField: FC<IInputFieldProps> = ({
	labelText,
	id,
	isValid,
	isError,
	duplicateCheck = false,
	checkFunc = () => {},
	...props
}) => {
	return (
		<div className={clsx(inputBox)}>
			<label
				className={isValid ? checkedLabel : label}
				htmlFor={id}
			>
				{labelText}
			</label>
			<div className="flex flex-row justify-between">
				<input
					className={clsx(input, {
						[invalidInput]: !isError,
						[inputWithBtn]: duplicateCheck,
					})}
					id={id}
					{...props}
				/>
				{duplicateCheck && (
					<DuplicationCheckButton onClick={checkFunc} />
				)}
			</div>
		</div>
	);
};

export default InputField;
