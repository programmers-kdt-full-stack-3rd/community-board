import { style } from "@vanilla-extract/css";

export const loginWrapper = style({
  position: "relative",
  width: "460px",
  height: "100%",
  boxSizing: "border-box",
  border: "1px solid #ccc",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "24px",
  gap: "10px",
});

export const loginForm = style({
  display: "flex",
  width: "100%",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "24px",
  gap: "24px",
});

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

export const errorMessageStyle = style({
  color: "red",
});

export const loginButton = style({
  width: "100%",
  height: "50px",
  padding: "0px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  backgroundColor: "#000",
  color: "#fff",
  cursor: "pointer",
  ":hover": {
    opacity: 0.8,
  },
});

export const joinButton = style({
  width: "100%",
  padding: "0px",
  cursor: "pointer",
  ":hover": {
    textDecoration: "underline",
    color: "blue",
  },
});
