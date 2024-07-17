import { style } from "@vanilla-extract/css";

export const commentFormContainer = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  rowGap: "8px",
  boxSizing: "border-box",
  width: "800px",
});

export const textArea = style({
  boxSizing: "border-box",
  border: "1px solid #80808080",
  borderRadius: "8px",
  padding: "4px 8px",
  width: "100%",
  minHeight: "100px",
  resize: "vertical",
  lineHeight: "1.5",
  fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
  fontSize: "16px",
});

export const footer = style({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "flex-start",
});

export const submitButton = style({
  selectors: {
    "&[disabled]": {
      cursor: "not-allowed",
    },
  },
});
