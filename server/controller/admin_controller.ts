import { Request, Response, NextFunction } from "express";
import {
	deleteUser,
	getUsersInfo,
	restoreUser,
} from "../db/context/users_context";
import { mapUsersInfoToResponse } from "../db/mapper/users_mapper";
import {
	deletePost,
	getAdminPosts,
	privatePost,
	publicPost,
	restorePost,
} from "../db/context/posts_context";
import { mapAdminPostsToResponse } from "../db/mapper/posts_mapper";
import { getLogs } from "../db/context/logs_context";
import { mapUserLogsToResponse } from "../db/mapper/logs_mapper";
import { getIntervalStats, getTotalStats } from "../db/context/stats_context";
import { TInterval } from "../db/model/stats";
import { mapStatsToResponse } from "../db/mapper/stats_mapper";
import { ServerError } from "../middleware/errors";

export const handleGetUsers = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		let index = parseInt(req.query.index as string) - 1 || 0;
		let perPage = parseInt(req.query.perPage as string) || 10;
		if (index < 0 || perPage < 0) {
			index = 0;
			perPage = 10;
		}

		let nickname = req.query.nickname as string;
		let email = req.query.email as string;
		const result = await getUsersInfo({ index, perPage, nickname, email });
		res.status(200).json(mapUsersInfoToResponse(result));
	} catch (err: any) {
		next(err);
	}
};

export const handleAdminDeleteUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = parseInt(req.params.userId);

		await deleteUser(userId);
		res.status(200).json({ message: "회원 삭제 성공" });
	} catch (err: any) {
		next(err);
	}
};

export const handleAdminRestoreUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = parseInt(req.params.userId);

		await restoreUser(userId);
		res.status(200).json({ message: "회원 복구 성공" });
	} catch (err: any) {
		next(err);
	}
};

export const handleAdminGetPosts = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const index = parseInt(req.query.index as string) - 1 || 0;
		const perPage = parseInt(req.query.perPage as string) || 10;
		const keyword = req.query.keyword as string;

		const posts = await getAdminPosts({ index, perPage, keyword });

		res.json(mapAdminPostsToResponse(posts));
	} catch (err) {
		next(err);
	}
};

export const handleAdminDeletePost = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const postId = parseInt(req.params.postId);

		await deletePost(postId);
		res.status(200).json({ message: "게시글 삭제 성공" });
	} catch (err: any) {
		next(err);
	}
};

export const handleAdminRestorePost = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const postId = parseInt(req.params.postId);

		await restorePost(postId);
		res.status(200).json({ message: "게시글 복구 성공" });
	} catch (err: any) {
		next(err);
	}
};

export const handleAdminPublicPost = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const postId = parseInt(req.params.postId);

		await publicPost(postId);
		res.status(200).json({ message: "게시글 공개 성공" });
	} catch (err: any) {
		next(err);
	}
};

export const handleAdminPrivatePost = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const postId = parseInt(req.params.postId);

		await privatePost(postId);
		res.status(200).json({ message: "게시글 비공개 성공" });
	} catch (err: any) {
		next(err);
	}
};

export const handleAdminGetLogs = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = parseInt(req.params.userId);
		const index = parseInt(req.query.index as string) - 1 || 0;
		const perPage = parseInt(req.query.perPage as string) || 10;

		const logs = await getLogs({ userId, index, perPage });

		res.json(mapUserLogsToResponse(logs));
	} catch (err) {
		next(err);
	}
};

export const handleAdminGetStats = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const startDate = req.query.startDate as string;
		const endDate = req.query.endDate as string;
		const interval = (req.query.interval as TInterval) || "daily";

		const isDate = (date: string) => {
			if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
				return false;
			}
			return !isNaN(new Date(date).getTime());
		};

		if (startDate && !isDate(startDate)) {
			throw ServerError.badRequest("startDate가 잘못되었습니다.");
		}

		if (endDate && !isDate(endDate)) {
			throw ServerError.badRequest("endDate가 잘못되었습니다.");
		}

		const totalStats = await getTotalStats();
		const intervalStats = await getIntervalStats({
			startDate,
			endDate,
			interval,
		});

		const stats = mapStatsToResponse(totalStats, intervalStats);

		res.status(200).json(stats);
	} catch (err: any) {
		next(err);
	}
};
