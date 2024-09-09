import { FC } from "react";
import InputForm from "./InputForm";

interface INicknameFormProps {
	nickname: string;
	labelText: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	duplicationCheckFunc?: () => void;
	errorMessage?: string;
	isValid?: boolean;
	isDuplicateCheck?: boolean;
}

const NicknameForm: FC<INicknameFormProps> = ({
	nickname,
	labelText,
	onChange,
	duplicationCheckFunc = () => {},
	errorMessage,
	isValid = false,
	isDuplicateCheck = false,
}) => {
	return (
		<InputForm
			value={nickname}
			labelText={labelText}
			type="email"
			onChange={onChange}
			placeholder="닉네임을 입력하세요."
			isDuplicateCheck={isDuplicateCheck}
			errorMessage={errorMessage}
			isValid={isValid}
			checkFunc={duplicationCheckFunc}
		/>
	);
};

export default NicknameForm;
