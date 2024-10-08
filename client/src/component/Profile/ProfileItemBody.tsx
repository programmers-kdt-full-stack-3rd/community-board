import React from "react";

interface Props {
	children: React.ReactNode;
}

const ProfileItemBody: React.FC<Props> = ({ children }) => {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "row",
				width: "100%",
				padding: "10px",
				border: "1px solid #ddd",
				borderRadius: "10px",
				justifyContent: "space-between",
			}}
		>
			{children}
		</div>
	);
};

export default ProfileItemBody;
