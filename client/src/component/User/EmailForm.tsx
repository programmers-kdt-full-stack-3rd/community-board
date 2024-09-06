import { FC } from "react";
import InputForm from "./InputForm";

interface IEmailFormProps {
	email: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	duplicationCheckFunc?: () => void;
	isValid?: boolean;
}

const EmailForm: FC<IEmailFormProps> = ({
	email,
	onChange,
	duplicationCheckFunc = () => {},
	isValid = true,
}) => {
	return (
		<InputForm
			value={email}
			labelText="이메일"
			type="email"
			onChange={onChange}
			placeholder="이메일을 입력하세요."
			isValid={isValid}
			isDuplicateCheck={true}
			checkFunc={duplicationCheckFunc}
		/>
	);
};

export default EmailForm;
