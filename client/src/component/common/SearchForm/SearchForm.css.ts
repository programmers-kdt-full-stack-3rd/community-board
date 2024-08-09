import { style } from "@vanilla-extract/css";

export const searchStyle = style({
	display: "flex",
	alignItems: "stretch",
	justifyContent: "center",
	columnGap: "8px",
});

export const searchInput = style({
	boxSizing: "border-box",
	margin: "1px 0",
	paddingLeft: "12px",
	paddingRight: "8px",
	border: "1px solid #808080a0",
	borderRadius: "8px",
	width: "240px",
	fontSize: "1rem",
});
