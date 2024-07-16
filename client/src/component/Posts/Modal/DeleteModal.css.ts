import { style } from "@vanilla-extract/css";
import { vars } from "../../../App.css.ts";

export const DeleteModalContainer = style({
    position : "absolute",
    top : "50%",
    left : "50%",
    transform : "translate(-50%, -50%)",
    width : "300px",
    height : "150px",
    background : vars.color.task,
    borderRadius : "5px",
    textAlign : "center",
    display : "flex",
    flexDirection : "column",
    padding : "10px",
    gap : "10px"
});

export const DeleteModalText = style({
    color : vars.color.darkText,
    fontWeight : "bold",
    fontSize : vars.fontSizing.T3,
    paddingTop : "30px",
    paddingBottom : "30px"
})

export const Btns = style({
    display : "flex",
    justifyContent : "space-between",
    paddingLeft : "30px",
    paddingRight : "30px"
});

export const DeleteBtn = style({
    backgroundColor : vars.color.deleteButton,
    color : vars.color.brightText,
    fontWeight : "bold"
});

export const CancleBtn = style({
    backgroundColor : vars.color.secondaryDarkText,
    color : vars.color.brightText,
    fontWeight : "bold"
});