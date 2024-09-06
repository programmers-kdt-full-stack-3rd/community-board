import { FC, InputHTMLAttributes } from "react";
import {
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
	duplicateCheck?: boolean;
	checkFunc?: () => void;
}

const InputField: FC<IInputFieldProps> = ({
	labelText,
	id,
	isValid,
	duplicateCheck = false,
	checkFunc = () => {},
	...props
}) => {
	return (
		<div className={clsx(inputBox)}>
			<label
				className={label}
				htmlFor={id}
			>
				{labelText}
			</label>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-between",
				}}
			>
				<input
					className={clsx(input, {
						[invalidInput]: !isValid,
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
