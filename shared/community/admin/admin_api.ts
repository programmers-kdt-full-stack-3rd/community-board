export interface IAdminPostResponse {
	total: number;
	postHeaders: {
		id: number;
		title: string;
		author: string;
		createdAt: Date;
		isDelete: boolean;
		isPrivate: boolean;
	}[];
}

export interface IUserLogResponse {
	total: number;
	logs: {
		title: string;
		category: string;
		createdAt: Date;
	}[];
}

export interface IUserInfoResponse {
	total: number;
	userInfo: {
		id: number;
		email: string;
		nickname: string;
		createdAt: Date;
		isDelete: boolean;
		statistics: {
			comments: number;
			posts: number;
		};
	}[];
}
