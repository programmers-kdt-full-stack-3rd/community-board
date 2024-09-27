import { IsDefined } from "class-validator";

export class CreateRoomBodyDto {

    @IsDefined()
    title: string;

    @IsDefined()
    isPrivate: boolean;

    password: string;
}

export class CreateRoomDto extends CreateRoomBodyDto {
    userId: number;
}

