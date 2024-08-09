import { style } from "@vanilla-extract/css";

export const loginWrapper = style({
	position: "relative",
	width: "460px",
	height: "100%",
	boxSizing: "border-box",
	border: "1px solid #ccc",
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	alignItems: "center",
	padding: "24px",
	gap: "10px",
});

export const joinLink = style({
	width: "100%",
	padding: "0px",
	cursor: "pointer",
	":hover": {
		textDecoration: "underline",
		color: "blue",
	},
});
