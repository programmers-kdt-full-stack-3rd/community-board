import { style } from "@vanilla-extract/css";
import { vars } from "../../App.css.ts";

export const mainPageStyle = style({
  display: "flex",
  flexDirection: "column",
  rowGap: "48px",
  alignItems: "stretch",
  width: "800px",
});

export const createPostButtonWrapper = style({
  display: "flex",
  justifyContent: "flex-end",
});

export const createPostButton = style({
  color: vars.color.brightText,
  fontWeight: "bold",
  backgroundColor: "#000",
  ":hover": {
    opacity: 0.8,
  },
});

export const postListActions = style({
  display: "flex",
  flexDirection: "column",
  rowGap: "8px",
});
