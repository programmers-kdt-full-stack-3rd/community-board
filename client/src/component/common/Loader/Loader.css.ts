import { style, keyframes } from "@vanilla-extract/css";

const spin = keyframes({
	from: { transform: "rotate(0deg)" },
	to: { transform: "rotate(360deg)" },
});

export const iconStyle = style({
	fontSize: "50px",
	animation: `${spin} 1s linear infinite`,
	color: "#bdbdbd",
});

export const containerStyle = style({
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	alignItems: "center",
});

export const textStyle = style({
	marginTop: "20px",
	fontSize: "16px",
	color: "#fff",
});
