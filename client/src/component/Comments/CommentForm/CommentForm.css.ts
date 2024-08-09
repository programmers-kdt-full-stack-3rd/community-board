import { style } from "@vanilla-extract/css";

export const commentFormContainer = style({
	display: "flex",
	flexDirection: "column",
	alignItems: "stretch",
	rowGap: "8px",
	boxSizing: "border-box",
	width: "100%",
});

export const textArea = style({
	boxSizing: "border-box",
	marginBottom: "",
	border: "1px solid #80808080",
	borderRadius: "8px",
	padding: "7px 11px",
	width: "100%",
	minHeight: "100px",
	resize: "vertical",
	lineHeight: "1.5",
	fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
	fontSize: "16px",
});

export const footer = style({
	display: "flex",
	justifyContent: "flex-end",
	alignItems: "flex-start",
	columnGap: "8px",
});

export const button = style({
	height: "40px",
	fontSize: "0.9rem",

	selectors: {
		"&[disabled]": {
			cursor: "not-allowed",
		},
	},
});
