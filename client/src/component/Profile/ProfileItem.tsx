import React, { SetStateAction } from "react";
import ProfileItemHeader from "./ProfileItemHeader";
import ProfileItemBody from "./ProfileItemBody";

interface Props {
	children: React.ReactNode;
	title: string;
	showEditIcon?: boolean;
	profileEdit: boolean;
	setProfileEdit: React.Dispatch<SetStateAction<boolean>>;
}

const ProfileItem: React.FC<Props> = ({
	children,
	title,
	showEditIcon = false,
	profileEdit,
	setProfileEdit,
}) => {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				width: "100%",
			}}
		>
			<ProfileItemHeader
				title={title}
				showEditIcon={showEditIcon}
				profileEdit={profileEdit}
				setProfileEdit={setProfileEdit}
			/>
			<ProfileItemBody>{children}</ProfileItemBody>
		</div>
	);
};

export default ProfileItem;
