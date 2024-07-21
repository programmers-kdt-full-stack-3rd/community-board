import { FC } from "react";
import InputField from "./InputField";

interface INicknameFormProps {
  labelText: string;
  nickname: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isValid?: boolean;
}

const NicknameForm: FC<INicknameFormProps> = ({
  labelText,
  nickname,
  onChange,
  isValid = true,
}) => {
  return (
    <InputField
      labelText={labelText}
      id="nickname"
      type="text"
      value={nickname}
      onChange={onChange}
      placeholder="닉네임을 입력하세요."
      isValid={isValid}
    />
  );
};

export default NicknameForm;
