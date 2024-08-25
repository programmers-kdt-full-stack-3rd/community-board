import { IRoomHeader } from "./dto";

export const mapDBToIRoomHeader = (dbData: any): IRoomHeader => {
	return {
		roomId: dbData.id,
		title: dbData.name,
		totalMembersCount: dbData.membersCount,
		isPrivate: dbData.is_private,
	};
};
