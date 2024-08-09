import { style } from "@vanilla-extract/css";

export const submitButtonStyle = style({
	width: "100%",
	height: "50px",
	padding: "0px",
	border: "1px solid #ccc",
	borderRadius: "4px",
	backgroundColor: "#000",
	color: "#fff",
	cursor: "pointer",
	":hover": {
		opacity: 0.8,
	},
});
