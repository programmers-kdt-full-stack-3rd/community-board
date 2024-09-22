import { style } from "@vanilla-extract/css";

export const chatRoomContainer = style({
	display: "flex",
	flexDirection: "column",
	width: "100%",
	height: "100%",
	color: "white",
});

export const chatRoomHeader = style({
	display: "flex",
	flexDirection: "row",
	justifyContent: "space-between",
	paddingTop: "10px",
	paddingBottom: "10px",
	paddingLeft: "20px",
	paddingRight: "20px",
	textAlign: "left",
});

export const chatRoomHeaderTitle = style({
	fontSize: "20px",
	fontWeight: "bold",
	color: "white",
});

export const chatRoomHeaderIcon = style({
	width: "24px",
	height: "24px",
	color: "white",
});

export const goBack = style({
	display: "flex",
	alignItems: "center",
	cursor: "pointer",
	":hover": {
		cursor: "pointer", // hover 시에도 클릭 커서로 유지
		opacity: 0.7,
	},
});

export const dropdown = style({
	display: "flex",
	alignItems: "center",
	cursor: "pointer",
	":hover": {
		cursor: "pointer", // hover 시에도 클릭 커서로 유지
		opacity: 0.7,
	},
});

export const chatRoomBody = style({
	display: "flex",
	flexDirection: "column",
	height: "500px",
	textAlign: "left",
	overflowY: "scroll",
	marginBottom: "20px",
});

export const myChatContainer = style({
	display: "flex",
	flexDirection: "row",
	justifyContent: "flex-end",
	paddingRight: "20px",
	paddingTop: "20px",
});

export const yourChatContainer = style({
	display: "flex",
	justifyContent: "flex-start",
	paddingLeft: "20px",
	paddingTop: "20px",
});

export const systemChatContainer = style({
	display: "flex",
	justifyContent: "center",
	textAlign: "center",
	paddingTop: "20px",
});

// TODO : 나와 상대방의 채팅 배경색 결정하기
export const myChat = style({
	display: "flex",
	paddingTop: "10px",
	paddingBottom: "10px",
	paddingLeft: "20px",
	paddingRight: "20px",
	maxWidth: "50%",
	borderRadius: "10px",
	border: "1px solid white",
	background: "",
});

// TODO : 나와 상대방의 채팅 배경색 결정하기
export const yourChat = style({
	display: "flex",
	paddingTop: "10px",
	paddingBottom: "10px",
	paddingLeft: "20px",
	paddingRight: "20px",
	maxWidth: "100%",
	borderRadius: "10px",
	border: "1px solid white",
	background: "",
});

// TODO : 시스템 채팅 배경색 결정하기
export const systemChat = style({
	// display: "flex",
	paddingTop: "10px",
	paddingBottom: "10px",
	paddingLeft: "20px",
	paddingRight: "20px",
	width: "80%",
	borderRadius: "10px",
	border: "1px solid white",
	background: "",
});

export const inputContainer = style({
	display: "flex",
	justifyContent: "row",
});

export const chatInput = style({
	width: "100%",
	height: "40px",
	borderTopLeftRadius: "20px",
	borderBottomLeftRadius: "20px",
	borderTopRightRadius: "0px",
	borderBottomRightRadius: "0px",
	paddingLeft: "20px",
	paddingRight: "20px",
	backgroundColor: "gray",
	border: "none",
});

export const SendButton = style({
	height: "42px",
	cursor: "pointer",
	backgroundColor: "#141414",
	borderTopLeftRadius: "0px",
	borderBottomLeftRadius: "0px",
	borderTopRightRadius: "20px",
	borderBottomRightRadius: "20px",
});
