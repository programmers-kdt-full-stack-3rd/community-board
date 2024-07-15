import { FC, ReactNode } from "react";
import { errorMessageStyle } from "./EmailForm.css";

interface IErrorMessageFormProps {
  children: ReactNode;
}

const ErrorMessageForm: FC<IErrorMessageFormProps> = ({ children }) => {
  return <div className={errorMessageStyle}>{children}</div>;
};

export default ErrorMessageForm;
