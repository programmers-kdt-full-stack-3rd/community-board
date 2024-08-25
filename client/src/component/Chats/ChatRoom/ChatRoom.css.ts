import { style } from "@vanilla-extract/css";

export const chatRoomContainer = style({
	display: "flex",
	flexDirection: "column",
	width: "80%",
	padding: "10px",
});

export const chatRoomHeader = style({
	display: "flex",
	flexDirection: "row",
	justifyContent: "space-between",
	border: "1px solid white",
	paddingTop: "10px",
	paddingBottom: "10px",
	paddingLeft: "20px",
	paddingRight: "20px",
	textAlign: "left",
});

export const goBack = style({
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
	border: "1px solid white",
	textAlign: "left",
	overflow: "scroll",
	paddingBottom: "20px",
});

export const myChatContainer = style({
	display: "flex",
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
	maxWidth: "50%",
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
	height: "34px",
});

export const SendButton = style({
	height: "40px",
	cursor: "pointer",
});
