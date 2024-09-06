import { FC } from "react";
import InputField from "./InputField";
import ErrorMessageForm from "./ErrorMessageForm";

interface IInputFormProps {
	value: string;
	labelText: string;
	type: string;
	placeholder: string;
	errorMessage?: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	isDuplicateCheck: boolean;
	checkFunc?: () => void;
	isValid?: boolean;
}

const InputForm: FC<IInputFormProps> = ({
	value,
	labelText,
	type,
	placeholder,
	errorMessage,
	onChange,
	isDuplicateCheck,
	checkFunc = () => {},
	isValid = true,
}) => {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
			}}
		>
			<InputField
				labelText={labelText}
				id={type}
				type={type}
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				isValid={isValid}
				duplicateCheck={isDuplicateCheck}
				checkFunc={checkFunc}
			/>
			{!isValid && <ErrorMessageForm>{errorMessage}</ErrorMessageForm>}
		</div>
	);
};

export default InputForm;
