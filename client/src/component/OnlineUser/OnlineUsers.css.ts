import { style } from "@vanilla-extract/css";

export const onlineUserContainer = style({
	position: "fixed",
	left: "50px",
	top: "300px",
	transform: "translateY(-50%)",
	width: "200px",
	padding: "10px",
	backgroundColor: "#808080",
	border: "3px solid white",
	borderRadius: "5px",
	color: "f0f0f0",
	fontWeight: "bold",
});

export const onlineUserList = style({
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	height: "300px",
	overflowY: "auto",
	padding: "10px",
	borderRadius: "4px",
});

export const onlineUserTitle = style({
	paddingBottom: "5px",
	borderBottom: "2px solid white",
});
