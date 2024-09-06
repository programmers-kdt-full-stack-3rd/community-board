import { FC } from "react";
import InputForm from "./InputForm";

interface IEmailFormProps {
	email: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	errorMessage?: string;
	isValid: boolean;
	duplicationCheckFunc?: () => void;
}

const EmailForm: FC<IEmailFormProps> = ({
	email,
	onChange,
	errorMessage,
	isValid,
	duplicationCheckFunc = () => {},
}) => {
	return (
		<InputForm
			value={email}
			labelText="이메일"
			type="email"
			onChange={onChange}
			placeholder="이메일을 입력하세요."
			isDuplicateCheck={true}
			errorMessage={errorMessage}
			isValid={isValid}
			checkFunc={duplicationCheckFunc}
		/>
	);
};

export default EmailForm;
