import { IAdminPostRow } from "../model/posts";

interface IAdminPostResponse {
	total: number;
	postHeaders: {
		id: number;
		title: string;
		author_id: number;
		created_at: Date;
		isDelete: boolean;
		is_private: boolean;
	}[];
}

export const mapAdminPostsToResponse = (
	queryResult: IAdminPostRow[]
): IAdminPostResponse => {
	const postHeaders = queryResult.map(row => {
		return {
			id: row.id,
			title: row.title,
			author_id: row.author_id,
			created_at: row.created_at,
			isDelete: row.isDelete,
			is_private: row.is_private,
		};
	});

	return {
		total: queryResult[0].total,
		postHeaders,
	};
};
