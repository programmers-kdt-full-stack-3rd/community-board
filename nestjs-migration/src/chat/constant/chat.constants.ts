export const CHAT_ERROR_CODES = {
	NO_REFERENCE: "ER_NO_REFERENCED_ROW_2",
};

export const CHAT_ERROR_MESSAGES = {
	CREATE_CHATROOM_ERROR: "채팅방 생성 실패",
	READ_CHATROOM_ERROR: "채팅방 불러오기 실패",
	READ_ROOM_MEMBERS_ERROR: "채팅방 멤버 목록 불러오기 실패",
	READ_MESSAGELOG_ERROR: "메세지 로그 불러오기 실패",
	ROOM_JOIN_ERROR: "채팅방 가입 실패",
	ENTER_JOIN_ERROR: "채팅방 입장 실패",
	LEAVE_ROOM_ERROR: "채팅방 떠나기 실패",
} as const;
