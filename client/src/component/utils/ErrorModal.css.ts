import { style } from "@vanilla-extract/css";
import { vars } from "../../App.css.ts";

export const Background = style({
	position: "absolute",
	top: 0,
	left: 0,
	width: "100%",
	height: "100%",
	background: vars.color.secondaryDarkText,
	opacity: 0.5,
});

export const ErrorModalContainer = style({
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: "300px",
	height: "fit",
	background: vars.color.task,
	borderRadius: "5px",
	textAlign: "center",
	display: "flex",
	flexDirection: "column",
	padding: "10px",
	gap: "10px",
	opacity: 2,
});

export const ErrorModalTitle = style({
	color: vars.color.deleteButton,
	fontWeight: "bold",
	fontSize: vars.fontSizing.T2,
});

export const ErrorModalText = style({
	color: vars.color.darkText,
	fontWeight: "bold",
	fontSize: vars.fontSizing.T3,
	paddingTop: "30px",
	paddingBottom: "30px",
});

export const Btn = style({
	display: "flex",
	justifyContent: "center",
	paddingLeft: "30px",
	paddingRight: "30px",
});

export const CheckBtn = style({
	backgroundColor: vars.color.successButton,
	color: vars.color.brightText,
	fontWeight: "bold",
});
