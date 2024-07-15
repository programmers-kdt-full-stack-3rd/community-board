import { style } from "@vanilla-extract/css";

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
    width : "780px",
    height : "100%",
    resize : "none",
    borderRadius : 5,
    padding : 10
});

export const FullButtons = style({
    display : "flex",
    justifyContent : "space-between",
    paddingTop : "20px",
    paddingBottom : "20px",
    paddingLeft : "10px",
    paddingRight : "10px"
});

export const OneButton = style({
    display : "flex",
    justifyContent : "center",
    paddingTop : "20px",
    paddingBottom : "20px",
    paddingLeft : "10px",
    paddingRight : "10px"
});