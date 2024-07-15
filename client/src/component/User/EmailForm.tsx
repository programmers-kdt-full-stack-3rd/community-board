import { FC } from "react";
import InputField from "./InputField";

interface IEmailFormProps {
  email: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EmailForm: FC<IEmailFormProps> = ({ email, onChange }) => {
  return (
    <InputField
      labelText="이메일"
      id="email"
      type="email"
      value={email}
      onChange={onChange}
      placeholder="이메일을 입력하세요."
    />
  );
};

export default EmailForm;
