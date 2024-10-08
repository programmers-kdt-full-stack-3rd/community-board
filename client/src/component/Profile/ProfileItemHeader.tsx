import React, { SetStateAction } from "react";
import { FiX } from "react-icons/fi";
import { IoMdSettings } from "react-icons/io";

interface Props {
	title: string;
	showEditIcon: boolean;
	profileEdit: boolean;
	setProfileEdit: React.Dispatch<SetStateAction<boolean>>;
}

const ProfileItemHeader: React.FC<Props> = ({
	title,
	showEditIcon,
	profileEdit,
	setProfileEdit,
}) => {
	const renderIcon = () => {
		if (!showEditIcon) {
			return;
		}

		if (profileEdit) {
			return (
				<FiX
					style={{
						cursor: "pointer",
						width: "20px",
						height: "20px",
					}}
					onClick={() => {
						setProfileEdit(false);
					}}
				/>
			);
		} else {
			return (
				<IoMdSettings
					style={{
						cursor: "pointer",
						width: "20px",
						height: "20px",
					}}
					onClick={() => {
						setProfileEdit(true);
					}}
				/>
			);
		}
	};

	return (
		<div
			style={{
				display: "flex",
				justifyContent: showEditIcon ? "space-between" : "flex-start",
				alignItems: "center",
				width: "100%",
				paddingLeft: "10px",
				paddingRight: "10px",
				paddingBottom: "10px",
			}}
		>
			<div
				style={{
					fontWeight: "bolder",
				}}
			>
				{title}
			</div>
			{renderIcon()}
		</div>
	);
};

export default ProfileItemHeader;
