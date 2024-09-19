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

export const loginButton = style({
	padding: "12px",
	backgroundColor: "#444",
	color: "white",
	fontSize: "18px",
	border: "none",
	borderRadius: "6px",
	cursor: "pointer",
});

export const joinLink = style({
	marginTop: "10px",
	textAlign: "center",
	fontSize: "14px",
	color: "#007BFF",
	cursor: "pointer",
});

// export const loginWrapper = style({
// 	position: "relative",
// 	width: "460px",
// 	height: "100%",
// 	boxSizing: "border-box",
// 	border: "1px solid #ccc",
// 	display: "flex",
// 	flexDirection: "column",
// 	justifyContent: "center",
// 	alignItems: "center",
// 	padding: "24px",
// 	gap: "10px",
// });

// export const joinLink = style({
// 	width: "100%",
// 	padding: "0px",
// 	cursor: "pointer",
// 	":hover": {
// 		textDecoration: "underline",
// 		color: "blue",
// 	},
// });
