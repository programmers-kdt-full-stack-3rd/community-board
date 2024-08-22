import { RowDataPacket } from "mysql2/promise";

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
