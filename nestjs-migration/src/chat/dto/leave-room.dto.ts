export class LeaveRoomBodyDto {
    roomId: number;
}

export class LeaveRoomDto extends LeaveRoomBodyDto {
    userId: number;
}