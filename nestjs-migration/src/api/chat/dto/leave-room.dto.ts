import { IsDefined, IsNumber } from "class-validator";

export class LeaveRoomReq {
	@IsDefined()
	@IsNumber()
	roomId: number;
}

export class LeaveRoomDto extends LeaveRoomReq {
	userId: number;
}
