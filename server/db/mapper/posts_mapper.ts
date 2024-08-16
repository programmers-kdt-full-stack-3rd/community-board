import { IAdminPostRow } from "../model/posts";

interface IAdminPostResponse {
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

export const mapAdminPostsToResponse = (
	queryResult: IAdminPostRow[]
): IAdminPostResponse => {
	const postHeaders = queryResult.map(row => {
		return {
			id: row.id,
			title: row.title,
			author: row.author,
			createdAt: row.created_at,
			isDelete: row.isDelete,
			isPrivate: row.is_private,
		};
	});

	return {
		total: queryResult[0].total,
		postHeaders,
	};
};
