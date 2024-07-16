import { style } from "@vanilla-extract/css";

export const main = style({
  display: "flex",
  flexDirection: "column",
});

export const card = style({
  display: "flex",
  justifyContent: "center",
  gap: "20px",
});

export const readTheDocs = style({
  color: "#888",
});
