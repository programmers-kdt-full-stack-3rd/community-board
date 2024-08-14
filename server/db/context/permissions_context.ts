import {
	FieldPacket,
	PoolConnection,
	ResultSetHeader,
	RowDataPacket,
} from "mysql2/promise";
import pool from "../connect";
import { ServerError } from "../../middleware/errors";

interface IPermission extends RowDataPacket {
	name: string;
}

export const getPermission = async (roleId: Number) => {
	let conn: PoolConnection | null = null;
	try {
		const sql = `SELECT name FROM permissions WHERE id = ?`;
		const value = [roleId];

		conn = await pool.getConnection();

		const [rows]: [IPermission[], FieldPacket[]] = await conn.query(
			sql,
			value
		);

		if (rows.length === 0) {
			throw ServerError.badRequest("Permission을 찾을 수 없습니다.");
		}

		return rows[0];
	} catch (err: any) {
		throw err;
	} finally {
		if (conn) conn.release();
	}
};

export const addPermission = async (name: string) => {
	let conn: PoolConnection | null = null;
	try {
		const sql = `INSERT INTO permissions (name) VALUES (?)`;
		const value = [name];

		conn = await pool.getConnection();
		const [rows]: [ResultSetHeader, FieldPacket[]] = await conn.query(
			sql,
			value
		);

		if (rows.affectedRows === 0) {
			throw ServerError.badRequest("Permission 추가 실패");
		}

		return;
	} catch (err: any) {
		throw err;
	} finally {
		if (conn) conn.release();
	}
};
