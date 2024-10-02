import { IsDefined, IsNumber } from "class-validator";

export class EnterRoomReq {
	@IsDefined()
	@IsNumber()
	roomId: number;
}

export class EnterRoomDto extends EnterRoomReq {
	userId: number;
}
