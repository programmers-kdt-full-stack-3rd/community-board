import { Transform } from "class-transformer";
import { IsDefined } from "class-validator";
import { IMessage } from "./message.dto";

export class RoomHeader {
	@Transform(({ value }) => parseInt(value))
	totalMembersCount: number;

	roomId: number;
	title: string;
	isPrivate: boolean;
}

export class GetRoomsRes {
	totalRoomCount: number;

	roomHeaders: RoomHeader[];
}

export class GetMsgLogsRes {
	messageLogs: IMessage[];
}

export class CreateRoomRes {
	roomId: number;
}

export class JoinRoomRes {
	roomId: number;
}

export class EnterRoomRes {
	memberId: number;
}
