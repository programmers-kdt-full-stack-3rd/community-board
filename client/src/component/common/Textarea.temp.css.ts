import { style } from "@vanilla-extract/css";

// TODO: Tailwind CSS로 옮긴 뒤 이 파일 제거
// - 임시 스타일 규칙이며, 컬러와 사이즈 등은 일단 아무 값이나 넣었습니다.

export const textareaBase = style({
	flex: "1 1",

	boxSizing: "border-box",
	margin: "0",
	border: "1px solid #737373",
	borderRadius: "0.5rem",
	padding: "0.5rem 0.75rem",
	background: "none",

	color: "#000000",
	fontFamily: "inherit",
	fontSize: "1rem",

	resize: "vertical",

	":disabled": {
		filter: "brightness(0.75)",
		cursor: "not-allowed",
	},
});

export const invalid = style({
	border: "1px solid #dc2626",
	backgroundColor: "#fef2f2",
});
