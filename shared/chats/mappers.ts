import { ILiveRoomInfo, IMessage, IRoomHeader, IRoomMembers } from "./dto";

export const mapDBToIMessage = (userId: number, dbData: any): IMessage => {
	return {
		roomId: dbData.room_id,
		nickname: dbData.nickname,
		message: dbData.message,
		createdAt: dbData.created_at,
		isMine: dbData.user_id === userId,
		isSystem: dbData.is_system,
	};
};

export const mapDBToIMessages = (
	userId: number,
	dbDatas: any[]
): IMessage[] => {
	return dbDatas.map(dbData => {
		return mapDBToIMessage(userId, dbData);
	});
};

export const mapDBToIRoomHeader = (
	dbData: any,
	liveRoomInfo: ILiveRoomInfo
): IRoomHeader => {
	return {
		roomId: dbData.id,
		title: dbData.name,
		totalMembersCount: dbData.membersCount,
		isPrivate: dbData.is_private,
		liveRoomInfo: liveRoomInfo,
	};
};

export const mapDBToIRoomHeaders = (dbDatas: any[]): IRoomHeader[] => {
	const liveRoomInfo = {
		lastMessage: {
			roomId: 0,
			nickname: "",
			message: "",
			createdAt: new Date(),
			isMine: false,
			isSystem: false,
		},
		curNum: 0,
		newMessages: 0,
	};

	return dbDatas.map(dbData => {
		return mapDBToIRoomHeader(dbData, liveRoomInfo);
	});
};

export const mapDBToLiveRoomInfo = (dbData: any): ILiveRoomInfo => {
	return {
		lastMessage: dbData.message,
		curNum: dbData.curNum,
		newMessages: dbData.newMessages,
	};
};

export const mapDBToIRoomMembers = (dbDatas: any[]) => {
	const roomMembers: IRoomMembers = {};

	dbDatas.forEach((dbData: any) => {
		if (roomMembers[dbData.room_id]) {
			roomMembers[dbData.room_id].push(dbData.id);
		} else {
			roomMembers[dbData.room_id] = [dbData.id];
		}
	});

	return roomMembers;
};
