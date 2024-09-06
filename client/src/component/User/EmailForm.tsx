import { FC } from "react";
import InputField from "./InputField";

interface IEmailFormProps {
	email: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	isValid?: boolean;
}

const EmailForm: FC<IEmailFormProps> = ({
	email,
	onChange,
	isValid = true,
}) => {
	return (
		<InputField
			labelText="이메일"
			id="email"
			type="email"
			value={email}
			onChange={onChange}
			placeholder="이메일을 입력하세요."
			isValid={isValid}
			duplicateCheck={true}
		/>
	);
};

export default EmailForm;
