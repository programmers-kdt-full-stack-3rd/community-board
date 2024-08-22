import { FieldPacket, PoolConnection } from "mysql2/promise";
import pool from "../connect";
import { ServerError } from "../../middleware/errors";
import {
	IPostResult,
	IPostResultInterval,
	IStatResult,
	IStatResultInterval,
	IStats,
	IStatsInterval,
	IStatsIntervalInput,
	IUserStat,
} from "../model/stats";

export const getTotalStats = async (): Promise<IStats> => {
	let conn: PoolConnection | null = null;
	try {
		conn = await pool.getConnection();

		const postSql = `
            SELECT COUNT(*) AS count, COALESCE(SUM(views), 0) AS views
            FROM posts p
            JOIN users u ON p.author_id = u.id
            WHERE p.isDelete = 0 AND u.isDelete = 0
        `;

		const commentSql = `
            SELECT COUNT(*) AS count
            FROM comments c
            JOIN users u ON c.author_id = u.id
            JOIN posts p ON c.post_id = p.id
            WHERE c.isDelete = 0 AND u.isDelete = 0 AND p.isDelete = 0
        `;

		const userSql = `
            SELECT COUNT(*) AS count
            FROM users
            WHERE isDelete = 0
        `;

		// 유효한 게시물 수와 총 조회수
		const [postResults]: [IPostResult[], FieldPacket[]] =
			await conn.query(postSql);

		// 유효한 댓글 수
		const [commentResults]: [IStatResult[], FieldPacket[]] =
			await conn.query(commentSql);

		// 유효한 사용자 수
		const [userResults]: [IStatResult[], FieldPacket[]] =
			await conn.query(userSql);

		return {
			posts: postResults[0].count,
			views: postResults[0].views || 0,
			comments: commentResults[0].count,
			users: userResults[0].count,
		};
	} catch (err: any) {
		throw err;
	} finally {
		if (conn) conn.release();
	}
};

export const getIntervalStats = async ({
	startDate,
	endDate,
	interval,
}: IStatsIntervalInput): Promise<IStatsInterval> => {
	let conn: PoolConnection | null = null;
	try {
		conn = await pool.getConnection();

		let dateFormat: string;

		switch (interval) {
			case "daily":
				dateFormat = "%Y-%m-%d";
				break;
			case "monthly":
				dateFormat = "%Y-%m";
				break;
			case "yearly":
				dateFormat = "%Y";
				break;
			default:
				throw ServerError.badRequest("잘못된 interval 값입니다.");
		}

		const value = [dateFormat];

		const commonSql = `
			GROUP BY date
		`;

		let postSql = `
        SELECT COUNT(*) AS count, COALESCE(SUM(views), 0) AS views, DATE_FORMAT(p.created_at, ?) AS date
        FROM posts p
        JOIN users u ON p.author_id = u.id
        WHERE p.isDelete = 0 AND u.isDelete = 0
        `;

		let commentSql = `
            SELECT COUNT(*) AS count, DATE_FORMAT(c.created_at, ?) AS date
            FROM comments c
            JOIN users u ON c.author_id = u.id
            JOIN posts p ON c.post_id = p.id
            WHERE c.isDelete = 0 AND u.isDelete = 0 AND p.isDelete = 0
        `;

		let userSql = `
            SELECT COUNT(*) AS count, DATE_FORMAT(u.created_at, ?) AS date
            FROM users u
            WHERE isDelete = 0
        `;

		if (startDate) {
			value.push(startDate);
			postSql += ` AND p.created_at >= ?`;
			commentSql += ` AND c.created_at >= ?`;
			userSql += ` AND u.created_at >= ?`;
		}
		if (endDate) {
			value.push(endDate);
			postSql += ` AND p.created_at <= DATE_ADD(?, INTERVAL 1 DAY)`;
			commentSql += ` AND c.created_at <= DATE_ADD(?, INTERVAL 1 DAY)`;
			userSql += ` AND u.created_at <= DATE_ADD(?, INTERVAL 1 DAY)`;
		}

		postSql += commonSql;
		commentSql += commonSql;
		userSql += commonSql;

		// 유효한 게시물 수와 총 조회수
		const [postResults]: [IPostResultInterval[], FieldPacket[]] =
			await conn.query(postSql, value);

		// 유효한 댓글 수
		const [commentResults]: [IStatResultInterval[], FieldPacket[]] =
			await conn.query(commentSql, value);

		// 유효한 사용자 수
		const [userResults]: [IStatResultInterval[], FieldPacket[]] =
			await conn.query(userSql, value);

		return {
			posts: postResults,
			comments: commentResults,
			users: userResults,
		};
	} catch (err: any) {
		throw err;
	} finally {
		if (conn) conn.release();
	}
};

export const getUserStat = async (userId: number): Promise<IUserStat> => {
	let conn: PoolConnection | null = null;
	try {
		conn = await pool.getConnection();

		const postSql = `
			SELECT COUNT(*) AS count, COALESCE(SUM(views), 0) AS views
			FROM posts
			WHERE author_id = ? AND isDelete = 0
		`;

		const commentSql = `
		SELECT COUNT(*) AS count
		FROM comments c
		JOIN posts p ON c.post_id = p.id
		WHERE c.author_id = 1 AND c.isDelete = 0 AND p.isDelete = 0
		`;

		// 유효한 게시물 수와 총 조회수
		const [postResults]: [IPostResult[], FieldPacket[]] = await conn.query(
			postSql,
			[userId]
		);

		// 유효한 댓글 수
		const [commentResults]: [IStatResult[], FieldPacket[]] =
			await conn.query(commentSql, [userId]);

		return {
			posts: postResults[0].count,
			views: postResults[0].views || 0,
			comments: commentResults[0].count,
		};
	} catch (err: any) {
		throw err;
	} finally {
		if (conn) conn.release();
	}
};
