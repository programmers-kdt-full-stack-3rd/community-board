import { FC, ReactNode } from "react";
import { submitButtonStyle } from "./css/SubmitButton.css";

interface ISubmitButtonProps {
	children: ReactNode;
	className?: string;
	onClick: () => void;
	apply?: boolean;
}

const SubmitButton: FC<ISubmitButtonProps> = ({
	children,
	className,
	onClick,
	apply = true,
}) => {
	return (
		<button
			disabled={!apply}
			className={className ? className : submitButtonStyle}
			onClick={onClick}
			type="submit"
		>
			{children}
		</button>
	);
};

export default SubmitButton;
