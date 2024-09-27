import { IsDefined, IsOptional } from "class-validator";

export class CreateRoomBodyDto {

    @IsDefined()
    title: string;

    @IsDefined()
    isPrivate: boolean;

    @IsOptional()
    password: string;
}

export class CreateRoomDto extends CreateRoomBodyDto {
    userId: number;
}

