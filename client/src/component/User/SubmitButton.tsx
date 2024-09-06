import { FC, ReactNode } from "react";
import { submitButtonStyle } from "./css/SubmitButton.css";

interface ISubmitButtonProps {
	children: ReactNode;
	onClick: () => void;
	apply?: boolean;
}

const SubmitButton: FC<ISubmitButtonProps> = ({
	children,
	onClick,
	apply = true,
}) => {
	return (
		<button
			disabled={!apply}
			className={submitButtonStyle}
			onClick={onClick}
			type="submit"
		>
			{children}
		</button>
	);
};

export default SubmitButton;
