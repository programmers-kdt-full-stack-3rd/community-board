import { FC } from "react";
import InputForm from "./InputForm";

interface IEmailFormProps {
	email: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	errorMessage?: string;
	isValid: boolean;
	isDuplicateCheck?: boolean;
	duplicationCheckFunc?: () => void;
}

const EmailForm: FC<IEmailFormProps> = ({
	email,
	onChange,
	errorMessage,
	isValid,
	isDuplicateCheck = false,
	duplicationCheckFunc = () => {},
}) => {
	return (
		<InputForm
			value={email}
			labelText="이메일"
			type="email"
			onChange={onChange}
			placeholder="이메일을 입력하세요."
			isDuplicateCheck={isDuplicateCheck}
			errorMessage={errorMessage}
			isValid={isValid}
			checkFunc={duplicationCheckFunc}
		/>
	);
};

export default EmailForm;
