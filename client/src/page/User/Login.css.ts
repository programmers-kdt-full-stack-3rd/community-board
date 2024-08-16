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
	":hover": {
		textDecoration: "underline",
	},
});

export const socialLoginButtons = style({
	display: "flex",
	flexDirection: "column",
	gap: "15px",
	marginTop: "20px",
});

export const socialButton = style({
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
});

export const googleButton = style([
	socialButton,
	{
		backgroundColor: "#fff",
		color: "black",
	},
]);

export const kakaoButton = style([
	socialButton,
	{
		backgroundColor: "#fee500",
		color: "#3c1e1e",
	},
]);

export const naverButton = style([
	socialButton,
	{
		backgroundColor: "#1ec800",
		color: "white",
	},
]);

export const iconStyle = style({
	width: "22px",
	height: "22px",
	marginRight: "10px",
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
