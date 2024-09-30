import React from "react";
import Button from "../common/Button";

interface Props {
	onClick: () => void;
}

const DuplicationCheckButton: React.FC<Props> = ({ onClick }) => {
	return (
		<div className="ml-4">
			<Button
				color="neutral"
				onClick={onClick}
				variant="solid"
			>
				중복확인
			</Button>
		</div>
	);
};

export default DuplicationCheckButton;
