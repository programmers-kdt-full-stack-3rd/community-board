import { style } from "@vanilla-extract/css";

export const container = style({
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	height: "90vh",
	textAlign: "center",
	position: "relative",
	padding: "0 20px",
});

export const content = style({
	maxWidth: "600px",
});

export const logo = style({
	fontSize: "100px",
	color: "#BDBDBD",
	marginBottom: "10px",
});

export const title = style({
	fontSize: "24px",
	fontWeight: "bold",
	marginBottom: "20px",
	color: "#BDBDBD",
});

export const description = style({
	fontSize: "16px",
	color: "#BDBDBD",
	marginBottom: "40px",
});

export const button = style({
	display: "inline-block",
	padding: "15px 25px",
	fontSize: "16px",
	color: "#BDBDBD",
	backgroundColor: "#000",
	borderRadius: "10px",
	textDecoration: "none",
});

export const backgroundText = style({
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	fontSize: "120px",
	fontWeight: "bold",
	color: "#212121",
	whiteSpace: "nowrap",
	pointerEvents: "none",
	userSelect: "none",
	zIndex: -1,
});
