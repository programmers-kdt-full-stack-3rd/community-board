import { style } from "@vanilla-extract/css";

export const chatBtnStyle = style({
	position: "fixed",
	bottom: "20px",
	right: "20px",
	marginTop: "20px",
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	borderRadius: "30px",
	width: "50px",
	height: "50px",
	backgroundColor: "#444444",
	cursor: "pointer",
	boxShadow: "0 0 5px white",
});
