import { style } from "@vanilla-extract/css";

export const joinWrapper = style({
	width: "100%",
	maxWidth: "350px",
	margin: "0 auto",
	padding: "20px",
	boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
	borderRadius: "15px",
	backgroundColor: "#333",
});

export const passwordReqStyle = style({
	color: "gray",
	fontSize: "12px",
	display: "none",
});
