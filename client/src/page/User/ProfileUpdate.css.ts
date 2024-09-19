import { style } from "@vanilla-extract/css";

export const profileUpdateWrapper = style({
	width: "100%",
	maxWidth: "350px",
	margin: "0 auto",
	padding: "20px",
	boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
	borderRadius: "15px",
	backgroundColor: "#333",
});

export const profileUpdateForm = style({
	display: "flex",
	flexDirection: "column",
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
