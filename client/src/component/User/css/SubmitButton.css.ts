import { style } from "@vanilla-extract/css";

export const submitButtonStyle = style({
	width: "100%",
	height: "50px",
	padding: "0",
	border: "1px solid #444",
	borderRadius: "6px",
	backgroundColor: "#555",
	color: "#fff",
	cursor: "pointer",
	margin: "15px 0",
	textAlign: "center",
	fontSize: "16px",

	":hover": {
		backgroundColor: "#666",
		opacity: 0.9,
	},
});
