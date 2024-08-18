import { FieldPacket, PoolConnection, ResultSetHeader } from "mysql2/promise";
import pool from "../connect";
import { ServerError } from "../../middleware/errors";

interface IUserLogData {
	user_id: number;
	title: string;
	category_id: number;
}

export const addLog = async (
	{ user_id, title, category_id }: IUserLogData,
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
