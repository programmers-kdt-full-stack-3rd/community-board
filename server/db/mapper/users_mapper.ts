import { IUser, IUserInfoRow } from "../model/users";

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

export const mapUsersInfoToResponse = (
	queryResult: IUserInfoRow[]
): IUserInfoResponse => {
	const userInfo = queryResult.map(row => {
		return {
			id: row.id,
			email: row.email,
			nickname: row.nickname,
			createdAt: row.created_at,
			isDelete: row.is_delete,
			statistics: {
				comments: row.comment_count,
				posts: row.post_count,
			},
		};
	});

	return {
		total: queryResult[0].total,
		userInfo,
	};
};

export const mapDBToPartialUser = (data: any): Partial<IUser> => {
	return {
		id: data.id,
		email: data.email,
		nickname: data.nickname,
		isDelete: data.is_delete ? true : false,
		password: data.password,
		salt: data.salt,
	};
};
