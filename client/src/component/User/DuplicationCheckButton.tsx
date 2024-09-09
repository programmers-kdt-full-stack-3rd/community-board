import React from "react";

interface Props {
	onClick: () => void;
}

const DuplicationCheckButton: React.FC<Props> = ({ onClick }) => {
	return (
		<button
			style={{
				paddingLeft: 10,
				paddingRight: 10,
			}}
			onClick={onClick}
		>
			중복 확인
		</button>
	);
};

export default DuplicationCheckButton;
