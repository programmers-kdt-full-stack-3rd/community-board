import { style } from "@vanilla-extract/css";

export const dropdownMenu = style({
  position: "absolute",
  top: "50px",
  right: 0,
  backgroundColor: "#333",
  zIndex: 1000,
  minWidth: "150px",
});

export const dropdownMenuItem = style({
  padding: "10px",
  color: "#fff",
  border: "1px solid white",
  ":hover": {
    opacity: 0.7,
    cursor: "pointer",
  },
});
