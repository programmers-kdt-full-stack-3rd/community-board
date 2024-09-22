import { style } from "@vanilla-extract/css";

export const container = style({
	display: "flex",
	flexDirection: "column",
	width: "100%",
	height: "100%",
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
	marginTop: "10px",
});

export const searchInput = style({
	width: "100%",
	height: "34px",
});

export const searchButton = style({
	padding: "0px",
	width: "50px",
	cursor: "pointer",
	height: "40px",
});

export const searchForm = style({
	display: "flex",
	width: "100%",
	gap: "10px",
});

export const createButton = style({
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	gap: "10px",
	padding: "0px",
	width: "50px",
	cursor: "pointer",
	height: "40px",
	":hover": {
		opacity: "0.7",
	},
});
