import { style } from "@vanilla-extract/css";

export const socialLoginButtons = style({
	display: "flex",
	flexDirection: "column",
	gap: "15px",
	marginTop: "20px",
	width: "100%",
});

export const socialLoginItem = style({
	display: "flex",
	gap: "15px",
	alignItems: "stretch",
	justifyContent: "stretch",
});

const socialButton = style({
	flexGrow: "1",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	padding: "12px",
	fontSize: "16px",
	fontWeight: "bold",
	borderRadius: "6px",
	border: "none",
	cursor: "pointer",
	color: "white",
	transition: "transform 0.2s, box-shadow 0.2s",

	selectors: {
		"&:disabled": {
			opacity: 0.5,
			filter: "saturate(0.5)",
		},
	},
});

export const googleButton = style([
	socialButton,
	{
		backgroundColor: "#fff",
		color: "black",
		":hover": {
			backgroundColor: "#f1f1f1",
			color: "#333",
			boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
		},
	},
]);

export const kakaoButton = style([
	socialButton,
	{
		backgroundColor: "#fee500",
		color: "#3c1e1e",
		":hover": {
			backgroundColor: "#fdd835",
			color: "#2e1b1b",
			boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
		},
	},
]);

export const naverButton = style([
	socialButton,
	{
		backgroundColor: "#1ec800",
		color: "white",
		":hover": {
			backgroundColor: "#17a500",
			color: "#e0e0e0",
			boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
		},
	},
]);

export const iconStyle = style({
	width: "22px",
	height: "22px",
	marginRight: "10px",
});
