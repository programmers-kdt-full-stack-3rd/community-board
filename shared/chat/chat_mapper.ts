import { IRoomHeader, IRoomMember } from "./chats";

export const mapDBToIRoomHeader = (dbData: any): IRoomHeader => {
	return {
		roomId: dbData.id,
		title: dbData.name,
		totalMembersCount: dbData.membersCount,
		isPrivate: dbData.is_private,
	};
};

export const mapDBToIRoomMember = (dbData: any): IRoomMember => {
	return {
		memberId: dbData.member_id,
		imgUrl: dbData.img_url ? dbData.img_url : "",
		nickname: dbData.nickname,
	};
};
