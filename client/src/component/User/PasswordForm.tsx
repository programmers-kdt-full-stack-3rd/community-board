import { FC } from "react";
import TextInput, { ITextInputProps } from "../common/TextInput";

interface IPasswordFormProps extends ITextInputProps {
	/**
	 * @property
	 * - `auth`: 인증 (로그인, 비밀번호 재확인)
	 * - `new`: 새 비밀번호 입력란 (회원가입, 비밀번호 변경)
	 * - `confirm`: 비밀번호 확인란 (회원가입, 비밀번호 변경)
	 */
	mode: "auth" | "new" | "confirm";
}

const PasswordForm: FC<IPasswordFormProps> = ({
	mode,
	placeholder,
	type = "password",
	...props
}) => {
	const preventCopyPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		e.preventDefault();
	};

	return (
		<TextInput
			{...props}
			type={type}
			placeholder={
				typeof placeholder === "string"
					? placeholder
					: mode === "new"
						? "10자 이상의 영문 대/소문자, 숫자를 사용"
						: "비밀번호를 입력하세요."
			}
			onCopy={preventCopyPaste}
			onPaste={preventCopyPaste}
			onCut={preventCopyPaste}
		/>
	);
};

export default PasswordForm;
