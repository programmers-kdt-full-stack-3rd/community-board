import { FC, InputHTMLAttributes } from "react";
import { input, inputBox, invalidInput, label } from "./css/InputField.css";
import clsx from "clsx";

interface IInputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  labelText: string;
  id: string;
  isValid?: boolean;
}

const InputField: FC<IInputFieldProps> = ({
  labelText,
  id,
  isValid,
  ...props
}) => {
  return (
    <div className={clsx(inputBox)}>
      <label className={label} htmlFor={id}>
        {labelText}
      </label>
      <input
        className={clsx(input, { [invalidInput]: !isValid })}
        id={id}
        {...props}
      />
    </div>
  );
};

export default InputField;
