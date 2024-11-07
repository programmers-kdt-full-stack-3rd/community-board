import { Transform } from "class-transformer";
import { IsBoolean, IsDefined, IsOptional, IsString } from "class-validator";

export class CreateRoomReq {
	@IsDefined()
	@IsString()
	title: string;

	@IsDefined()
	@Transform(({ value }) => value === "true")
	@IsBoolean()
	isPrivate: boolean;

	@IsOptional()
	@IsString()
	password?: string;
}

export class CreateRoomDto extends CreateRoomReq {
	userId: number;
}
