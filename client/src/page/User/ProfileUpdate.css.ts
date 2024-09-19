import { style } from "@vanilla-extract/css";

export const profileUpdateWrapper = style({
	position: "relative",
	width: "460px",
	height: "100%",
	boxSizing: "border-box",
	border: "1px solid #ccc",
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	alignItems: "stretch",
	padding: "24px",
	gap: "10px",
});

export const buttonsWrapper = style({
	width: "100%",
	display: "flex",
	flexDirection: "row",
	justifyContent: "space-between",
	gap: "10px",
});

export const cancleButton = style({
	width: "100%",
	height: "50px",
	margin: "15px 0",
	padding: "0px",
	borderRadius: "4px",
	backgroundColor: "gray",
	color: "#fff",

	":hover": {
		filter: "brightness(0.8)",
		cursor: "pointer",
	},
});
