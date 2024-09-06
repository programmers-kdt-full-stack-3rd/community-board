import { FC } from "react";
import InputField from "./InputField";
import ErrorMessageForm from "./ErrorMessageForm";

interface IPasswordFormProps {
	labelText: string;
	id?: string;
	password: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	placeholder?: string;
	errorMessage?: string;
	isValid: boolean;
}

const PasswordForm: FC<IPasswordFormProps> = ({
	labelText,
	id = "password",
	password,
	onChange,
	placeholder,
	errorMessage,
	isValid,
}) => {
	const preventCopyPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		e.preventDefault();
	};
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
			}}
		>
			<InputField
				labelText={labelText}
				id={id}
				type="password"
				value={password}
				onChange={onChange}
				placeholder={
					placeholder ? placeholder : "비밀번호를 입력하세요."
				}
				isValid={isValid}
				isError={!errorMessage?.length}
				onCopy={preventCopyPaste}
				onPaste={preventCopyPaste}
				onCut={preventCopyPaste}
			/>
			{errorMessage && (
				<ErrorMessageForm>{errorMessage}</ErrorMessageForm>
			)}
		</div>
	);
};

export default PasswordForm;
