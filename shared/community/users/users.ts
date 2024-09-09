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
