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
	id: number;
	email: string;
	nickname: string;
	created_at: Date;
	isDelete: boolean;
	comment_count: number;
	post_count: number;
}

export interface IUserInfoRow extends IUserInfo, RowDataPacket {}
