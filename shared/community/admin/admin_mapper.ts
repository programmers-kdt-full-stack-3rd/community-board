import { IUser } from "../users/users";
import { IAdminPostRow, IntervalStat, IUserInfoRow } from "./admin";
import { IUserLogRow } from "./admin";
import { IStats, IStatsInterval } from "./admin";
import {
	IAdminPostResponse,
	IUserInfoResponse,
	IUserLogResponse,
} from "./admin_api";

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

export const mapStatsToResponse = (
	totalStats: IStats,
	intervalStats: IStatsInterval
) => {
	const combinedResults: IntervalStat[] = [];
	const dateMap = new Map<string, IntervalStat>();

	for (
		let i = 0;
		i < intervalStats.posts.length ||
		i < intervalStats.comments.length ||
		i < intervalStats.users.length;
		i++
	) {
		const post = intervalStats.posts[i];
		const comment = intervalStats.comments[i];
		const user = intervalStats.users[i];

		if (post) {
			let stat = dateMap.get(post.date);
			if (!stat) {
				stat = {
					date: post.date,
					posts: 0,
					comments: 0,
					views: 0,
					users: 0,
				};
				dateMap.set(post.date, stat);
				combinedResults.push(stat);
			}
			stat.posts = post.count;
			stat.views = post.views;
		}

		if (comment) {
			let stat = dateMap.get(comment.date);
			if (!stat) {
				stat = {
					date: comment.date,
					posts: 0,
					comments: 0,
					views: 0,
					users: 0,
				};
				dateMap.set(comment.date, stat);
				combinedResults.push(stat);
			}
			stat.comments = comment.count;
		}

		if (user) {
			let stat = dateMap.get(user.date);
			if (!stat) {
				stat = {
					date: user.date,
					posts: 0,
					comments: 0,
					views: 0,
					users: 0,
				};
				dateMap.set(user.date, stat);
				combinedResults.push(stat);
			}
			stat.users = user.count;
		}
	}

	// 날짜순 정렬
	combinedResults.sort((a, b) => a.date.localeCompare(b.date));

	return {
		totalStats: {
			posts: totalStats.posts,
			views: totalStats.views,
			comments: totalStats.comments,
			users: totalStats.users,
		},
		intervalStats: combinedResults,
	};
};

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
		total: queryResult[0].total,
		userInfo,
	};
};

export const mapDBToPartialUser = (data: any): Partial<IUser> => {
	return {
		id: data.id,
		email: data.email,
		nickname: data.nickname,
		isDelete: data.isDelete ? true : false,
		password: data.password,
		salt: data.salt,
	};
};
