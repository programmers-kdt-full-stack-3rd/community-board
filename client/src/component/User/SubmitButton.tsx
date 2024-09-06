import { FC, ReactNode } from "react";

interface ISubmitButtonProps {
	children: ReactNode;
	className: string;
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
			className={className}
			onClick={onClick}
			type="submit"
		>
			{children}
		</button>
	);
};

export default SubmitButton;
