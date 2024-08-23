import { RowDataPacket } from "mysql2/promise";

export interface IUser {
	id: number;
	email: string;
	nickname: string;
	isDelete: boolean;
	password: string;
	salt: string;
}

export interface IUserInfo {
	total: number;
	id: number;
	email: string;
	nickname: string;
	created_at: Date;
	isDelete: boolean;
	comment_count: number;
	post_count: number;
}

export interface IPagenation {
	index: number;
	perPage: number;
}

export interface IGetUsersInfoParams extends IPagenation {
	nickname?: string;
	email?: string;
}

export interface IUserInfoRow extends IUserInfo, RowDataPacket {}
