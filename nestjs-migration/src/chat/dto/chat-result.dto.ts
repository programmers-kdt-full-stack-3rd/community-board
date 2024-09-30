import { Transform } from "class-transformer";

export class IRoomHeader {
    @Transform(({value})=> parseInt(value))
    totalMembersCount: number;
    
    roomId: number;
    title: string;
    isPrivate: boolean;
}

export class GetRoomsResultDto {
    totalRoomCount: number;
    roomHeaders: IRoomHeader[];

}

export class ICreateRoomResult {
    roomId:number;
}

export class IJoinRoomResult{
    roomId: number;
}


export class EnterRoomResultDto {
    memberId: number;
}