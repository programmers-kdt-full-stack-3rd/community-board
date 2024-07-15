import { FC, InputHTMLAttributes } from "react";
import { input, inputBox, label } from "./InputField.css";

interface IInputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  labelText: string;
  id: string;
}

const InputField: FC<IInputFieldProps> = ({ labelText, id, ...props }) => {
  return (
    <div className={inputBox}>
      <label className={label} htmlFor={id}>
        {labelText}
      </label>
      <input className={input} id={id} {...props} />
    </div>
  );
};

export default InputField;
