import { style } from "@vanilla-extract/css";

export const loginContainer = style({
	width: "100%",
	maxWidth: "350px",
	margin: "0 auto",
	padding: "20px",
	boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
	borderRadius: "15px",
	backgroundColor: "#333",
});

export const loginForm = style({
	display: "flex",
	flexDirection: "column",
	gap: "10px",
});

export const loginButton = style({
	padding: "12px",
	backgroundColor: "#444",
	color: "white",
	fontSize: "18px",
	border: "none",
	borderRadius: "6px",
	cursor: "pointer",
});

export const joinText = style({
	marginBottom: "0",
});

export const joinLink = style({
	marginTop: "10px",
	textAlign: "center",
	fontSize: "14px",
	color: "#007BFF",
	cursor: "pointer",
});
