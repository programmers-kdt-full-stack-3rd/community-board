import { IMessage, IRoomHeader } from "./chats";

// 채팅방 생성 --------------------------------------------------

export interface ICreateRoomRequest {
	title: string; // 채팅방 제목
	isPrivate: boolean; // true -> 비밀 방
	password: string; // 방 비밀번호 (null 허용)
}

export interface ICreateRoomResponse {
	roomId: string; // 생성된 방 번호
}

// 채팅방 조회, 검색 --------------------------------------------------

export interface IReadRoomRequest {
	page: number; // 현재 페이지 (default 0)
	perPage: number; // 한 페이지 당 보여줄 채팅방 개수
	isSearch: boolean; // true -> 검색, false -> 내 채팅방 조회
	keyword: string; // 방 비밀번호 (null 허용)
}

export interface IReadRoomResponse {
	totalRoomCount: number; // pagenation x 한 검색결과 개수
	roomHeaders: IRoomHeader[]; // pagenation o 한 검색결과
}

// 채팅방 가입 --------------------------------------------------

export interface IJoinRoomRequestEvent {
	roomId: number; // 가입 할 채팅방 번호
	nickname: string;
	isPrivate: boolean; // 비밀 방 여부
	password: string; // 방 비밀번호 (null 허용)
}

export interface IJoinRoomRequest {
	roomId: number; // 가입 할 채팅방 번호
	nickname: string; // 보낸 사람 이름
	isPrivate: boolean; // 비밀 방 여부
	password: string; // 방 비밀번호 (null 허용)
}

export interface IJoinRoomResponse {
	roomId: number; // 가입 된 채팅방 번호
}

// 가입 성공 시, 채팅방의 사람들이 받는 socket event response
export interface IJoinUserResponse {
	message: IMessage; // 시스템 메세지 - 가입 환영
}

// 채팅방 입장 --------------------------------------------------
export interface IEnterRoomRequest {
	roomId: number; // 채팅방 번호
}

export interface IEnterRoomResponse {
	memberId: number; // 입장 번호
	messageLogs?: IMessage[];
}

// 채팅방 탈퇴 --------------------------------------------------

export interface ILeaveRoomRequest {
	roomId: number; // 해당 방 번호
}

// 내가 속한 채팅방 조회 socket event request -------------------

export interface IGetMyRoomRequestEvent {
	page: number;
	nickname: string;
}

// 채팅방의 이전 메세지 기록 조회 ------------------------------------

export interface IGetRoomMessageLogsRequest {
	roomId: number; // 해당 방 번호
}

export interface IGetRoomMessageLogsResponse {
	messageLogs: IMessage[]; // 채팅 로그
}

// 메세지 발신, 수신 -----------------------------------------------

// 발신
export interface ISendMessageRequest {
	roomId: string;
	message: string;
}

// 수신
export interface IReceiveMessageResponse {
	message: IMessage;
}
