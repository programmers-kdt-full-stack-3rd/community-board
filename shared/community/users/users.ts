import { TOAuthProvider } from "../oauth/oauths";

export interface IUser {
	id: number;
	email: string;
	nickname: string;
	isDelete: boolean;
	password: string;
	salt: string;
}

export interface INonSensitiveUser {
	email: string | null;
	nickname: string;
	connected_oauth: TOAuthProvider[];
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

export interface IUserProfile {
	id: number;
	email: string;
	nickname: string;
	imgUrl: string;
}

export interface IPagenation {
	index: number;
	perPage: number;
}
