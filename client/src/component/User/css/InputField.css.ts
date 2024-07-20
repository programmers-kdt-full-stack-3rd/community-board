import { style } from "@vanilla-extract/css";

export const inputBox = style({
  display: "flex",
  width: "100%",
  flexDirection: "column",
  textAlign: "left",
  gap: "4px",
});

export const label = style({
  width: "100%",
  fontSize: "20px",
  fontWeight: "bold",
});

export const input = style({
  width: "100%",
  height: "40px",
  padding: "0px",
  fontSize: "20px",
  border: "1px solid #ccc",
  borderRadius: "4px",
});

export const invalidInput = style({
  border: "1px solid red",
  backgroundColor: "#ffebee",
});
