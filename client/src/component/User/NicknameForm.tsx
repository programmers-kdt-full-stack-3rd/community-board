import { FC } from "react";
import InputForm from "./InputForm";

interface INicknameFormProps {
	nickname: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	duplicationCheckFunc?: () => void;
	errorMessage?: string;
	isValid: boolean;
}

const NicknameForm: FC<INicknameFormProps> = ({
	nickname,
	onChange,
	duplicationCheckFunc = () => {},
	errorMessage,
	isValid,
}) => {
	return (
		<InputForm
			value={nickname}
			labelText="닉네임"
			type="email"
			onChange={onChange}
			placeholder="닉네임을 입력하세요."
			isDuplicateCheck={true}
			errorMessage={errorMessage}
			isValid={isValid}
			checkFunc={duplicationCheckFunc}
		/>
	);
};

export default NicknameForm;
