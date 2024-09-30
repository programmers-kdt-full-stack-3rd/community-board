import React from "react";
import Button from "../common/Button";

interface Props {
	onClick: () => void;
}

const DuplicationCheckButton: React.FC<Props> = ({ onClick }) => {
	return (
		<Button
			color="neutral"
			onClick={onClick}
			variant="solid"
		>
			중복확인
		</Button>
	);
};

export default DuplicationCheckButton;
