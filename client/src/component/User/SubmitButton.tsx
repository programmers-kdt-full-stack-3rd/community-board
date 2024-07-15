import { FC, ReactNode } from "react";
import { submitButtonStyle } from "./SubmitButton.css";

interface ISubmitButtonProps {
  children: ReactNode;
  onClick: () => void;
}

const SubmitButton: FC<ISubmitButtonProps> = ({ children, onClick }) => {
  return (
    <button className={submitButtonStyle} onClick={onClick} type="submit">
      {children}
    </button>
  );
};

export default SubmitButton;
