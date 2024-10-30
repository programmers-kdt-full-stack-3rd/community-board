import { style, styleVariants } from "@vanilla-extract/css";

export const container = style({
	height: "100%",
});

export const chatRoomsStyle = style({
	display: "flex",
	flexDirection: "column",
	width: "100%",
	height: "100%",
});

export const loginGuidanceStyle = style({
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	alignItems: "center",
	color: "white",
	height: "100%",
});

export const roomsWrapper = style({
	width: "100%",
	height: "100%",
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-between",
});

export const searchContainer = style({
	display: "flex",
	flexDirection: "row",
	justifyContent: "space-between",
	marginTop: "10px",
});

export const searchInput = style({
	width: "100%",
	height: "40px",
	paddingLeft: "15px",
	paddingRight: "15px",
	borderRadius: "10px",
	backgroundColor: "gray",
	border: "none",
});

export const searchButton = style({
	padding: "0px",
	width: "50px",
	cursor: "pointer",
	height: "42px",
});

export const searchForm = style({
	display: "flex",
	width: "100%",
	gap: "10px",
});

export const createButton = style({
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	gap: "10px",
	padding: "0px",
	width: "50px",
	cursor: "pointer",
	height: "40px",
	":hover": {
		opacity: "0.7",
	},
});

export const chatFooterStyle = style({
	display: "grid",
	gridTemplateColumns: "repeat(2, auto)",
	cursor: "pointer",
	width: "100%",
	height: "40px",
});

export const chatCategoryStyle = style({
	cursor: "pointer",
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	alignItems: "center",
});

export const chatIconStyle = styleVariants({
	active: {
		color: "white",
		width: "30px",
		height: "30px",
	},
	inactive: {
		color: "gray",
		width: "30px",
		height: "30px",
	},
});

export const chatIconTextStyle = styleVariants({
	active: {
		color: "white",
	},
	inactive: {
		color: "gray",
	},
});

export const chatRoomsContainer = style({
	display: "flex",
	flexDirection: "column",
	gap: "20px",
	height: "calc(100% - 54px)",
});

export const searchedChatRoomsStyle = style({
	display: "flex",
	flexDirection: "column",
	overflowY: "hidden",
	height: "100%",
});

export const searchedChatRoomInfoStyle = style({
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	height: "100%",
	color: "white",
});

export const myRoomTitleContainer = style({
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
	fontSize: "20px",
	fontWeight: "bold",
	marginLeft: "10px",
	color: "white",
});

export const myRoomTitleTextStyle = style({
	fontSize: "24px",
	fontWeight: "bold",
	color: "white",
});
