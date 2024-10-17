import { Transform } from "class-transformer";
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
	@Transform(({ value }) => value === "true")
	@IsBoolean()
	isPrivate: boolean;

	@IsDefined()
	@IsString()
	password: string;
}

export class JoinRoomDto extends JoinRoomReq {
	userId: number;
}
