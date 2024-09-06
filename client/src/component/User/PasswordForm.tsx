import { FC } from "react";
import InputField from "./InputField";

interface IPasswordFormProps {
	labelText: string;
	id?: string;
	password: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	isValid?: boolean;
	placeholder?: string;
}

const PasswordForm: FC<IPasswordFormProps> = ({
	labelText,
	id = "password",
	password,
	onChange,
	isValid = true,
	placeholder,
}) => {
	const preventCopyPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		e.preventDefault();
	};
	return (
		<InputField
			labelText={labelText}
			id={id}
			type="password"
			value={password}
			onChange={onChange}
			placeholder={placeholder ? placeholder : "비밀번호를 입력하세요."}
			isValid={isValid}
			onCopy={preventCopyPaste}
			onPaste={preventCopyPaste}
			onCut={preventCopyPaste}
		/>
	);
};

export default PasswordForm;
