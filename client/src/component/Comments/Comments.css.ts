import { style } from "@vanilla-extract/css";

export const commentSection = style({
	display: "flex",
	flexDirection: "column",
	justifyContent: "flex-start",
	alignItems: "stretch",
	rowGap: "20px",
	boxSizing: "border-box",
	margin: "20px 0",
	width: "800px",
	textAlign: "left",
});

export const commentSectionTitle = style({
	boxSizing: "border-box",
	margin: 0,
	borderBottom: "1px solid black",
	padding: "0 12px 8px",
	fontSize: "20px",
});

export const commentCount = style({
	fontSize: "0.8em",
});

export const commentWriteSection = style({
	display: "flex",
	flexDirection: "column",
	rowGap: "8px",
	boxSizing: "border-box",
	width: "100%",
});

export const commentFormTitle = style({
	margin: 0,
	padding: "0 12px",
	fontSize: "18px",
});

export const commentList = style({
	display: "flex",
	flexDirection: "column",
	rowGap: "20px",
});

export const noComment = style({
	margin: "0 0 120px",
	textAlign: "center",
	color: "#808080",
	fontSize: "24px",
});
