import { style } from "@vanilla-extract/css";

// TODO: Tailwind CSS로 옮긴 뒤 이 파일 제거
// - 임시 스타일 규칙이며, 컬러와 사이즈 등은 일단 아무 값이나 넣었습니다.

export const outerWrapper = style({
	flex: "1 1",

	display: "flex",
	flexDirection: "column",
	gap: "0.25rem",

	textAlign: "left",
});

export const labelStyle = style({
	display: "block",
	marginLeft: "0.25rem",

	color: "#1e3a8a",
	fontSize: "0.875rem",
	fontWeight: "bold",
});

export const labelOkStyle = style({
	"::after": {
		content: "✔",
		marginLeft: "0.5em",
	},
});

export const labelErrorStyle = style({
	color: "#dc2626",

	"::after": {
		content: "✘",
		marginLeft: "0.5em",
	},
});

export const innerWrapper = style({
	flex: "1 1",

	display: "flex",
	gap: "1rem",
});

export const textInputBase = style({
	flex: "1 1",

	boxSizing: "border-box",
	margin: "0",
	border: "1px solid #737373",
	borderRadius: "0.5rem",
	padding: "0 0.75rem",
	height: "40px",
	background: "none",

	color: "#000000",
	fontFamily: "inherit",
	fontSize: "1rem",

	":disabled": {
		filter: "brightness(0.75) saturate(0.5)",
		cursor: "not-allowed",
	},
});

export const invalidTextInput = style({
	border: "1px solid #dc2626",
	backgroundColor: "#fef2f2",
	color: "#000000",
});

export const errorMessageWrapper = style({
	marginLeft: "0.25rem",

	color: "#dc2626",
	fontSize: "0.875rem",
});
