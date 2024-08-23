import { RowDataPacket } from "mysql2";
import { IPagenation } from "./users";

export interface IAddUserLogInput {
	user_id: number;
	title: string;
	category_id: number;
}

export interface IUserQueryParams extends IPagenation {
	userId: number;
}

export interface IUserLog {
	total: number;
	title: string;
	category: string;
	createdAt: Date;
}

export interface IUserLogRow extends IUserLog, RowDataPacket {}
