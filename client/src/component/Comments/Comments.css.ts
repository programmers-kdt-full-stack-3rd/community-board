import { style } from "@vanilla-extract/css";

export const commentSection = style({
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "stretch",
  boxSizing: "border-box",
  margin: "40px 0",
  width: "800px",
  textAlign: "left",
});

export const commentSectionTitle = style({
  boxSizing: "border-box",
  margin: 0,
  borderBottom: "1px solid black",
  padding: "0 12px 8px",
  fontSize: "20px",
});

export const commentCount = style({
  fontSize: "0.8em",
});

export const commentList = style({
  display: "flex",
  flexDirection: "column",
  rowGap: "40px",
  margin: "40px 0",
});
