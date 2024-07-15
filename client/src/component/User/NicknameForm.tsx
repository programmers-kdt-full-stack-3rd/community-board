import { FC } from "react";
import InputField from "./InputField";

interface INicknameFormProps {
  labelText: string;
  nickname: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const NicknameForm: FC<INicknameFormProps> = ({
  labelText,
  nickname,
  onChange,
}) => {
  return (
    <InputField
      labelText={labelText}
      id="nickname"
      type="text"
      value={nickname}
      onChange={onChange}
      placeholder="닉네임을 입력하세요."
    />
  );
};

export default NicknameForm;
