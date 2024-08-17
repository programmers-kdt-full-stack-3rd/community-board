import { IMessage } from "./dto";

// 채팅방의 이전 메세지 기록 조회 ------------------------------------

export interface IGetRoomMessageLogsRequest {
	roomId: string; // 해당 방 번호
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
