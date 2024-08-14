// 채팅방 기능 타입 정의 (declaration)

// 채팅방 조회
export interface IReadRoomRequest {
	page: number;
	perPage: number;
	is_search: boolean;
	keyword: string | null;
}

export interface IRoomHeader {
	roomId: string;
	title: string;
	is_private: boolean;
	lastMessage: string;
	participantNum: number; // 채팅방에 속한 사람들
	curNum: number; // 현재 접속 중인 사람들
}

interface IReadRoomResponse {
	totalRoomCount: number;
	roomHeaders: IRoomHeader[];
}

// 채팅방 생성
export interface ICreateRoomRequest {
	title: string;
	is_private: boolean; // true면 password 사용하는 로직
	password: string | null;
}

export interface ICreateRoomResponse {
	roomId: string;
}

// 채팅방 입장
export interface IJoinRoomRequest {
	roomId: string;
	is_private: boolean;
	password: string | null; //추가
}

export interface IJoinUserResponse {
	roomId: string;
	nickname: string;
	message: string;
	created_at: Date;
}

// 채팅방 나가기
export interface ILeaveRoomRequest {
	roomId: string;
}

export interface ILeaveRoomResponse {
	message: string;
}

export interface ILeaveUserResponse {
	roomId: string;
	nickname: string;
	message: string;
	created_at: Date;
}

// 응답 메세지
export interface IReceiveResponse {
	message: string;
}
