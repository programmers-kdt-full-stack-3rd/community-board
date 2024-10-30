import { style } from "@vanilla-extract/css";

export const container = style({
	display: "flex",
	flexDirection: "column",
	gap: "10px",
	justifyContent: "center",
});

export const roomWrapper = style({
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	border: "1px solid white",
	borderRadius: "10px",
	padding: "10px",
	cursor: "pointer",
	":hover": {
		opacity: 0.7,
	},
});

export const roomContainer = style({
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
});

export const roomHeaderContainer = style({
	display: "flex",
	flexDirection: "row",
	justifyContent: "space-between",
	color: "white",
});

export const titleContainer = style({
	display: "flex",
	flexDirection: "row",
	justifyContent: "center",
	alignItems: "center",
});

export const lockIcon = style({
	width: "20px",
	height: "20px",
});

export const numContainer = style({
	display: "flex",
	gap: "10px",
});

export const chatContainer = style({
	width: "100%",
});

export const passwordInput = style({
	width: "50%",
	height: "34px",
});
