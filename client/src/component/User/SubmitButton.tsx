import { FC, ReactNode } from "react";
import { submitButtonStyle } from "./css/SubmitButton.css";

interface ISubmitButtonProps {
	children: ReactNode;
	onClick: () => void;
	canJoin?: boolean;
}

const SubmitButton: FC<ISubmitButtonProps> = ({
	children,
	onClick,
	canJoin = true,
}) => {
	return (
		<button
			disabled={canJoin}
			className={submitButtonStyle}
			onClick={onClick}
			type="submit"
		>
			{children}
		</button>
	);
};

export default SubmitButton;
