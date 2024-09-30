export class EnterRoomBodyDto {
    roomId: number;
}

export class EnterRoomDto extends EnterRoomBodyDto {
    userId: number;
}