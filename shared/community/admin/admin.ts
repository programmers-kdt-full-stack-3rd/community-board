import { RowDataPacket } from "mysql2";
import { IPagenation, IUserInfo } from "../users/users";

export interface IAdminPost {
	id: number;
	title: string;
	author: string;
	created_at: Date;
	updated_at: Date;
	isDelete: boolean;
	is_private: boolean;
}

export interface IAdminPostRow extends IAdminPost, RowDataPacket {}

export interface IntervalStat {
	date: string;
	posts: number;
	comments: number;
	views: number;
	users: number;
}

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

export interface IStatResult extends RowDataPacket {
	count: number;
}

export interface IStatResultInterval extends IStatResult {
	date: string;
}

export interface IPostResult extends IStatResult {
	views: number;
}

export interface IPostResultInterval extends IPostResult {
	date: string;
}

export interface IStats {
	posts: number;
	comments: number;
	views: number;
	users: number;
}

export interface IUserStat extends Omit<IStats, "users"> {}

export interface IStatsInterval {
	posts: IPostResultInterval[];
	comments: IStatResultInterval[];
	users: IStatResultInterval[];
}

export interface IStatsIntervalInput {
	startDate?: string;
	endDate?: string;
	interval: TInterval;
}

export type TInterval = "daily" | "monthly" | "yearly";

export interface IGetUsersInfoParams extends IPagenation {
	nickname?: string;
	email?: string;
}

export interface IUserInfoRow extends IUserInfo, RowDataPacket {}
