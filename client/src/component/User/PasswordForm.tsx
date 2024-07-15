import { FC } from "react";
import InputField from "./InputField";

interface IPasswordFormProps {
  password: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordForm: FC<IPasswordFormProps> = ({ password, onChange }) => {
  return (
    <InputField
      labelText="비밀번호"
      id="password"
      type="password"
      value={password}
      onChange={onChange}
      placeholder="비밀번호를 입력하세요."
    />
  );
};

export default PasswordForm;
