import { style } from "@vanilla-extract/css";

// TODO: Tailwind CSS로 옮긴 뒤 이 파일 제거
// - 임시 스타일 규칙이며, 컬러와 사이즈 등은 일단 아무 값이나 넣었습니다.

export const buttonBase = style({
	boxSizing: "border-box",
	margin: "0",
	border: "0",
	borderRadius: "0.5rem",
	background: "none",

	color: "#ffffff",
	fontFamily: "inherit",
	fontWeight: "bold",

	cursor: "pointer",

	":hover": {
		filter: "brightness(1.1)",
	},

	":disabled": {
		filter: "brightness(0.75) saturate(0.5)",
		cursor: "not-allowed",
	},
});

export const smallSize = style({
	padding: "0.375rem 0.75em",
	lineHeight: "1.125rem",
	fontSize: "0.875em",
});
export const mediumSize = style({
	padding: "0.5rem 1rem",
	lineHeight: "1.375rem",
	fontSize: "1rem",
});
export const largeSize = style({
	padding: "0.75rem 1.5rem",
	lineHeight: "1.375rem",
	fontSize: "1.125em",
});

export const primaryBackground = style({
	backgroundColor: "#1e3a8a",
});
export const primaryText = style({
	color: "#1e3a8a",
});
export const primaryOutline = style({
	border: "1px solid #1e3a8a",
});

export const actionBackground = style({
	backgroundColor: "#3b82f6",
});
export const actionText = style({
	color: "#3b82f6",
});
export const actionOutline = style({
	border: "1px solid #3b82f6",
});

export const neutralBackground = style({
	backgroundColor: "#737373",
});
export const neutralText = style({
	color: "#737373",
});
export const neutralOutline = style({
	border: "1px solid #737373",
});

export const dangerBackground = style({
	backgroundColor: "#dc2626",
});
export const dangerText = style({
	color: "#dc2626",
});
export const dangerOutline = style({
	border: "1px solid #dc2626",
});
