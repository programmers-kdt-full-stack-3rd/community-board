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
				isValid={!errorMessage?.length}
				duplicateCheck={isDuplicateCheck}
				checkFunc={checkFunc}
			/>
			{errorMessage && (
				<ErrorMessageForm>{errorMessage}</ErrorMessageForm>
			)}
		</div>
	);
};

export default InputForm;
