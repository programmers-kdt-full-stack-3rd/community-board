import { IsOptional } from "class-validator";

export class ReadRoomQueryDto {

    @IsOptional()
    page: number = 0;

    @IsOptional()
    perPage: number = 2;

    @IsOptional()
    isSearch: boolean; //string??

    @IsOptional()
    keyword: string;
}

export class ReadRoomByKeywordDto extends ReadRoomQueryDto {}

export class ReadRoomByUserIdDto {
    userId: number;
    page: number;
    perPage: number;
}


