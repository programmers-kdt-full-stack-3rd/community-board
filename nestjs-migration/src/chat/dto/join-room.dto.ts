import {
	IsBoolean,
	IsDefined,
	IsNumber,
	IsOptional,
	IsString,
} from "class-validator";

export class JoinRoomReq {
	@IsDefined()
	@IsNumber()
	roomId: number;

	@IsOptional()
	@IsString()
	nickname?: string;

	@IsDefined()
	@IsBoolean()
	isPrivate: boolean;

	@IsDefined()
	@IsString()
	password: string;
}

export class JoinRoomDto extends JoinRoomReq {
	userId: number;
}
