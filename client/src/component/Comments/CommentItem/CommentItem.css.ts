import { style } from "@vanilla-extract/css";

export const commentContainer = style({
	display: "flex",
	flexDirection: "column",
	justifyContent: "flex-start",
	alignItems: "stretch",
	boxSizing: "border-box",
	width: "800px",
	textAlign: "left",

	":first-child": {
		marginTop: "0",
	},
});

export const commentHeader = style({
	display: "flex",
	justifyContent: "flex-start",
	alignItems: "baseline",
	columnGap: "16px",
	boxSizing: "border-box",
	borderBottom: "1px solid #80808040",
	padding: "0 12px 8px",
	width: "100%",
	fontSize: "0.95em",
});

export const commentAuthor = style({
	fontWeight: "bold",
});

export const commentTimestamp = style({
	color: "#808080",
	fontSize: "0.9em",
});

export const isCommentUpdated = style({
	fontSize: "0.9em",
	opacity: 0.7,
	cursor: "help",

	":hover": {
		opacity: 1,
		textDecoration: "underline dotted",
	},
});

export const commentBody = style({
	width: "100%",
});

export const commentContent = style({
	boxSizing: "border-box",
	padding: "8px 12px",
	width: "100%",
});

export const commentFooter = style({
	display: "flex",
	justifyContent: "space-between",
	boxSizing: "border-box",
	padding: "0 12px",
	width: "100%",
	fontSize: "0.9rem",
});

export const commentEditButtons = style({
	display: "flex",
	columnGap: "8px",
});
