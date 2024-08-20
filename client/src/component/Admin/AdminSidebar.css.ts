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
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', 
    alignItems: 'center', 
});

export const SidebarItem = style({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
});

export const SidebarLink = style({
    width : '100%',
    padding: '10px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    ':hover': {
        backgroundColor: '#808080',
    },
});