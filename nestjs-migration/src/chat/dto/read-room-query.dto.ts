
export class ReadRoomQueryDto {
    
    page: number = 0;

    perPage: number = 2;

    isSearch: boolean; //string??

    keyword: string;
}

export class ReadRoomByKeywordDto extends ReadRoomQueryDto {}

export class ReadRoomByUserIdDto {
    userId: number;
    page: number;
    perPage: number;
}


