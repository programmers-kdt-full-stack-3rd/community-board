import { style } from "@vanilla-extract/css";

export const paginationStyle = style({
	display: "flex",
	justifyContent: "center",
	columnGap: "8px",
	verticalAlign: "baseline",
});

export const pageButton = style({
	padding: "0",
	width: "44px",
	height: "44px",
});

export const arrowButton = style({
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	backgroundColor: "#80808040",
});

export const current = style({
	backgroundColor: "#808080",
	color: "#fff",
	fontWeight: "bold",
});
