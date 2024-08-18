import { ILiveRoomInfo, IMessage, IRoomHeader } from "./dto";

export const mapDBToIMessage = (userId: number, dbData: any): IMessage => {
	return {
		roomId: dbData.roomId,
		nickname: dbData.nickname,
		message: dbData.message,
		createdAt: dbData.createdAt,
		isMine: dbData.senderId === userId,
		isSystem: dbData.senderId === 0,
	};
};

export const mapDBToIRoomHeader = (dbData: any): IRoomHeader => {
	return {
		roomId: dbData.roomId,
		title: dbData.title,
		totalMembersCount: dbData.total,
		isPrivate: dbData.isPrivate,
		liveRoomInfo: mapDBToLiveRoomInfo(dbData),
	};
};

export const mapDBToLiveRoomInfo = (dbData: any): ILiveRoomInfo => {
	return {
		lastMessage: dbData.message,
		curNum: dbData.curNum,
		newMessages: dbData.newMessages,
	};
};
