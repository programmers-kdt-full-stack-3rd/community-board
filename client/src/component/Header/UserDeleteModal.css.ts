import { style } from "@vanilla-extract/css";
import { vars } from "../../App.css";

export const modalOverlay = style({
	position: "fixed",
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
	backgroundColor: "rgba(0, 0, 0, 0.5)",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	zIndex: 1000,
});

export const modalContainer = style({
	backgroundColor: "white",
	padding: "20px",
	borderRadius: "8px",
	maxWidth: "400px",
	width: "100%",
});

export const deleteMessage = style({
	fontSize: "16px",
	lineHeight: 1.5,
	color: vars.color.darkText,
	marginBottom: "20px",
	textAlign: "center",
	padding: "15px",
	backgroundColor: "#fff3cd",
	border: "1px solid #ffeeba",
	borderRadius: "4px",
	boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
});

export const titleStyle = style({
	color: vars.color.darkText,
	fontWeight: "bold",
	fontSize: "30px",
	margin: "20px",
});

export const mention = style({
	color: "gray",
	fontSize: "20px",
});

export const buttons = style({
	display: "flex",
	flexDirection: "row",
	justifyContent: "space-around",
	alignItems: "center",
	rowGap: "10px",
});

export const cancleButton = style({
	backgroundColor: "gray",
	color: vars.color.brightText,
	width: "120px",
	height: "50px",
	borderRadius: "5px",
	border: "none",
	cursor: "pointer",
	":hover": {
		opacity: 0.8,
	},
});

export const summitButton = style({
	backgroundColor: vars.color.deleteButton,
	color: vars.color.brightText,
	width: "120px",
	height: "50px",
	borderRadius: "5px",
	border: "none",
	cursor: "pointer",
	":hover": {
		opacity: 0.8,
	},
});
