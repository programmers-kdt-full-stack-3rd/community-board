import { ILiveRoomInfo, IRoomHeader } from "./dto";

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
			memberId: 1,
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
