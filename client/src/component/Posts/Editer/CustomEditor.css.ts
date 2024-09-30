import { globalStyle, style } from "@vanilla-extract/css";

export const container = style({
	color: "black",
});

globalStyle(
	`${container} .rdw-image-modal-size-input, .rdw-image-modal-url-input, .rdw-embedded-modal-link-input, .rdw-embedded-modal-size-input, .rdw-link-modal-input`,
	{
		backgroundColor: "white",
	}
);

globalStyle(`${container} button`, {
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
});

globalStyle(`${container} .rdw-link-modal`, {
	height: "auto",
	boxSizing: "border-box",
});

globalStyle(
	`${container} .rdw-link-modal-buttonsection, .rdw-image-modal-btn-section`,
	{
		display: "flex",
		flexDirection: "row",
	}
);
