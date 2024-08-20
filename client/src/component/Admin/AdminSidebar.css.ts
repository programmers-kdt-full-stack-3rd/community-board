import { style } from "@vanilla-extract/css";

export const SidebarContainer = style({
    backgroundColor: "rgba(51, 51, 51, 0.8)", 
    color: "#ecf0f1", 
    cursor: "pointer",
    padding: "10px",
    transition: "transform 0.3s ease-in-out, background-color 0.3s",
    width: "250px",
    height: "100vh",
    position: "fixed",
    top: "0",
    left: "-250px",
    zIndex: "1000",
    transform: "translateX(0)",
});

export const SidePageContent = style({
    marginLeft: "0", 
    minHeight: "100vh",
    boxSizing: "border-box",
});