import { style } from "@vanilla-extract/css";
import { vars } from "../../App.css.ts";

export const PostHeader = style({
    display : "flex",
    flexDirection : "column",
    width : "800px",
    paddingTop : "10px",
    paddingBottom : "10px"
});

export const Title = style({
    display : "flex",
    justifyContent : "start",
    borderBottom : "1px solid black",
    padding : "5px",
    fontSize : "30px",
    fontWeight : "bold"
});

export const EtcInfo = style({
    display : "flex",
    flexDirection : "row",
    justifyContent : "space-between",
    padding : "5px"
});

export const EtcInfoItem = style({
    display : "flex",
    flexDirection : "row",
    justifyContent : "space-between",
    gap : "10px"
});

export const PostBody = style({
    display : "flex",
    flexDirection : "column",
    textAlign : "start",
    backgroundColor : vars.color.brightText,
    color : vars.color.darkText,
    width : "780px",
    height : "350px",
    resize : "none",
    borderRadius : 5,
    padding : 10
});

export const Buttons = style({});