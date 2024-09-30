import { FC, ReactNode } from "react";
import Button from "../common/Button";

interface ISubmitButtonProps {
	children: ReactNode;
	className?: string;
	onClick: () => void;
	apply?: boolean;
}

const SubmitButton: FC<ISubmitButtonProps> = ({
	children,
	onClick,
	apply = true,
}) => {
	return (
		<Button
			className="mt-5"
			disabled={!apply}
			onClick={onClick}
			type="submit"
			color="neutral"
			variant="solid"
			size="large"
		>
			{children}
		</Button>
	);
};

export default SubmitButton;
