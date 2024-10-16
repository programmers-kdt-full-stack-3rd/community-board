import { FC, ReactNode } from "react";

interface IErrorMessageFormProps {
	children: ReactNode;
}

const ErrorMessageForm: FC<IErrorMessageFormProps> = ({ children }) => {
	return <div className="w-full text-left text-red-500">{children}</div>;
};

export default ErrorMessageForm;
