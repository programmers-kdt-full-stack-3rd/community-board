import { IUserLogRow } from "../model/logs";

export interface IUserLogResponse {
	total: number;
	logs: {
		title: string;
		category: string;
		createdAt: Date;
	}[];
}

export const mapUserLogsToResponse = (
	queryResult: IUserLogRow[]
): IUserLogResponse => {
	const total = queryResult[0].total;
	const logs = queryResult.map(log => {
		return {
			title: log.title,
			category: log.category,
			createdAt: log.created_at,
		};
	});

	return { total, logs };
};
