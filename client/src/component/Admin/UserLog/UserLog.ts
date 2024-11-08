import { useEffect, useState } from "react";
import { IUserLogResponse } from "shared";
import { ClientError } from "../../../api/errors";
import { ApiCall } from "../../../api/api";
import { fetchUserLogs, fetchUserStats } from "../../../api/admin/user_crud";

export const useFetchUserData = (
	userId: number,
	initialPage: number,
	itemsPerPage: number
) => {
	const [logs, setLogs] = useState<IUserLogResponse>({
		total: 0,
		logs: [],
	});
	const [stats, setStats] = useState({ posts: 0, comments: 0, views: 0 });
	const [error, setError] = useState<string | null>(null);
	const [nickname, setNickname] = useState<string | null>(null);

	const fetchLogs = async () => {
		ApiCall(
			() => fetchUserLogs(userId, initialPage, itemsPerPage),
			() => {
				setLogs({
					total: 0,
					logs: [],
				});
			}
		).then(res => {
			if (res instanceof ClientError) {
				setError("로그 정보를 가져오는 데 실패했습니다.");
				return;
			}
			setLogs(res);
		});
	};

	const fetchStats = async () => {
		ApiCall(
			() => fetchUserStats(userId),
			() => {
				setStats({
					posts: 0,
					comments: 0,
					views: 0,
				});
			}
		).then(res => {
			if (res instanceof ClientError) {
				setError("통계 정보를 가져오는 데 실패했습니다.");
				return;
			}
			setNickname(res.nickname);
			setStats({
				posts: res.stats.posts,
				comments: res.stats.comments,
				views: res.stats.views,
			});
		});
	};

	useEffect(() => {
		if (!isNaN(userId)) {
			fetchLogs();
			fetchStats();
		}
	}, [userId, initialPage]);

	return { logs, stats, error, nickname };
};
