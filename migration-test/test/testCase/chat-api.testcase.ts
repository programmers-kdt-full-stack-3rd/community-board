import { IApiTestCase } from "../interface/api-test-case.interface";

export const ChatApiTests: Record<string, IApiTestCase> = {
	messageLog: {
		description: "메시지 로그 조회 성공",
		endpoint: "/api/chat/room/1",
		method: "get",
	},

	roomRead: {
		description: "채팅방 조회 성공",
		endpoint: "/api/chat/rooms",
		method: "get",
	},

	roomEnter: {
		description: "채팅방 입장 성공",
		endpoint: "/api/chat/enter",
		method: "post",
		data: {
			roomId: 1,
		},
	},

	roomJoin: {
		description: "채팅방 참여 성공",
		endpoint: "/api/chat/join",
		method: "post",
		data: {
			roomId: 1,
		},
	},

	roomCreate: {
		description: "채팅방 생성 성공",
		endpoint: "/api/chat/room",
		method: "post",
		data: {
			title: "채팅방 제목",
			isPrivate: false,
		},
	},

	roomLeave: {
		description: "채팅방 나가기 성공",
		endpoint: "/api/chat/leave",
		method: "post",
		data: {
			roomId: 1,
		},
	},
};
