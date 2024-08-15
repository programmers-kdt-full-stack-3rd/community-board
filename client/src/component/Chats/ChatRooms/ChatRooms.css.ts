import { style } from "@vanilla-extract/css";

export const container = style({
	display: "flex",
	flexDirection: "column",
	width: "80%",
	height: "500px",
});

export const roomsWrapper = style({
	width: "100%",
	height: "50%",
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-between",
});

export const searchContainer = style({
	display: "flex",
	flexDirection: "row",
	justifyContent: "space-between",
});

export const searchInput = style({
	width: "50%",
	height: "34px",
});

export const searchButton = style({
	cursor: "pointer",
	height: "40px",
});

export const searchForm = style({
	display: "flex",
	width: "100%",
	gap: "10px",
});

export const createButton = style({
	cursor: "pointer",
	width: "40px",
	height: "40px",
	":hover": {
		opacity: "0.7",
	},
});
