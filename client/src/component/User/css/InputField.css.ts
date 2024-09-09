import { style } from "@vanilla-extract/css";

export const inputBox = style({
	display: "flex",
	width: "100%",
	flexDirection: "column",
	textAlign: "left",
	gap: "4px",
});

export const label = style({
	width: "100%",
	fontSize: "15px",
	fontWeight: "bold",
});

export const checkedLabel = style({
	width: "100%",
	fontSize: "15px",
	fontWeight: "bold",
	color: "#36B700",
});

export const input = style({
	width: "100%",
	height: "40px",
	paddingLeft: "10px",
	paddingRight: "10px",
	fontSize: "14px",
	border: "1px solid #ccc",
	borderRadius: "4px",
});

export const inputWithBtn = style({
	width: "65%",
	height: "40px",
	paddingLeft: "10px",
	paddingRight: "10px",
	fontSize: "14px",
	border: "1px solid #ccc",
	borderRadius: "4px",
});

export const invalidInput = style({
	paddingLeft: "10px",
	paddingRight: "10px",
	border: "1px solid red",
	backgroundColor: "#ffebee",
	color: "black",
});
