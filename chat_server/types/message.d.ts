// 메세지 기능 타입 정의 (declaration)

// 메세지 전송
export interface ISendMessageRequest {
	roomId: string;
	nickname: string;
	message: string;
	created_at: Date;
}

// 메세지 수신
export interface IMessage {
	roomId: string;
	nickname: string;
	message: string;
	created_at: Date;
	is_mine: boolean;
	is_system: boolean;
}

export interface IReceiveMessageResponse {
	message: IMessage;
}

// 채팅방 메세지 기록 가져오기
export interface IReceiveMessageLogsRequest {
	roomId: string;
}

export interface IReceiveMessageLogsResponse {
	messages: IMessage[];
}
