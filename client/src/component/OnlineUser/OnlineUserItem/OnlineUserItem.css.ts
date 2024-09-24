import { style } from "@vanilla-extract/css";

export const onlineUserItem = style({
	display: "flex",
	justifyContent: "center",
	marginBottom: "5px",
	padding: "8px",
	borderRadius: "4px",
});

export const onlineUserStatus = style({
	fontSize: "14px",
	fontWeight: "bold",
});

export const onlineUserDot = style({
	width: "10px",
	height: "10px",
	backgroundColor: "green",
	borderRadius: "50%",
	marginTop: "5px",
	marginRight: "10px",
});
