export class JoinRoomBodyDto {
    roomId: number;
    nickname?: string;
    isPrivate: boolean;
    password: string;
}

export class JoinRoomDto extends JoinRoomBodyDto{
    userId: number;
}
