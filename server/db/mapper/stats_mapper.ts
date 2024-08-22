import { IStats, IStatsInterval } from "../model/stats";

export interface IntervalStat {
	date: string;
	posts: number;
	comments: number;
	views: number;
	users: number;
}

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
