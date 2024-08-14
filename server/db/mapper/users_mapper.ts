import { IUserInfoRow } from "../model/users";

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
			isDelete: row.isDelete,
			statistics: {
				comments: row.comment_count,
				posts: row.post_count,
			},
		};
	});

	return {
		total: userInfo.length,
		userInfo,
	};
};
