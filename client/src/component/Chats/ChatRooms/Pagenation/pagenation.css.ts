import { style } from "@vanilla-extract/css";
import { vars } from "../../../../App.css";

export const container = style({
	display: "flex",
	justifyContent: "center",
	gap: "10px",
});

export const page = style({
	cursor: "pointer",
	":hover": {
		opacity: "0.7",
	},
});

export const activePage = style({
	fontSize: vars.fontSizing.T3,
});
