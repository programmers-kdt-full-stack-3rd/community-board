import { FieldPacket, PoolConnection, ResultSetHeader } from "mysql2/promise";
import pool from "../connect";
import { ServerError } from "../../middleware/errors";
import { IAddUserLogInput, IUserLogRow, IUserQueryParams } from "shared";

export const addLog = async (
	{ user_id, title, category_id }: IAddUserLogInput,
	conn: PoolConnection
) => {
	try {
		const sql = `INSERT INTO user_logs (user_id, title, category_id) VALUES (?, ?, ?)`;
		const value = [user_id, title, category_id];

		const [rows]: [ResultSetHeader, FieldPacket[]] = await conn.query(
			sql,
			value
		);

		if (rows.affectedRows === 0) {
			throw ServerError.badRequest("Log 추가 실패");
		}

		return;
	} catch (err: any) {
		throw err;
	}
};

export const getLogs = async ({ userId, index, perPage }: IUserQueryParams) => {
	let conn: PoolConnection | null = null;

	try {
		conn = await pool.getConnection();

		const sql = `SELECT COUNT(*) OVER() as total, logs.title, categories.name as category, logs.created_at 
        FROM user_logs as logs
        LEFT JOIN user_log_categories as categories
        ON logs.category_id = categories.id 
        WHERE logs.user_id = ?
        ORDER BY logs.created_at DESC
        LIMIT ? OFFSET ?`;

		const value = [userId, perPage, index * perPage];

		const [rows]: [IUserLogRow[], FieldPacket[]] = await conn.query(
			sql,
			value
		);

		return rows;
	} catch (err) {
		throw err;
	} finally {
		if (conn) conn.release();
	}
};
