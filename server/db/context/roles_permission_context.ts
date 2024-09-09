import { FieldPacket, PoolConnection, ResultSetHeader } from "mysql2/promise";
import pool from "../connect";
import { ServerError } from "../../middleware/errors";
import { IPermissionRow } from "shared";

export const getRolePermission = async (roleId: number) => {
	let conn: PoolConnection | null = null;
	try {
		const sql = `SELECT p.id AS permission_id, p.name AS permission_name
		FROM role_permission rp
		JOIN permissions p ON rp.permission_id = p.id
		WHERE rp.role_id = ?`;
		const value = [roleId];

		conn = await pool.getConnection();
		const [rows]: [IPermissionRow[], FieldPacket[]] = await conn.query(
			sql,
			value
		);

		if (rows.length === 0) {
			throw ServerError.badRequest("Permission을 찾을 수 없습니다.");
		}

		return rows;
	} catch (err: any) {
		throw err;
	} finally {
		if (conn) conn.release();
	}
};

export const addPermissionToRole = async (
	roleId: number,
	permissionId: number
) => {
	let conn: PoolConnection | null = null;
	try {
		const sql = `INSERT INTO role_permission (role_id, permission_id) VALUES (?, ?)`;
		const values = [roleId, permissionId];

		conn = await pool.getConnection();
		const [result]: [ResultSetHeader, FieldPacket[]] = await conn.query(
			sql,
			values
		);

		if (result.affectedRows === 0) {
			throw ServerError.badRequest("권한 매핑 실패");
		}

		return result.insertId;
	} catch (err: any) {
		if (err.code === "ER_DUP_ENTRY") {
			throw ServerError.badRequest(
				"이미 해당 역할에 권한이 매핑되어 있습니다."
			);
		}
		throw err;
	} finally {
		if (conn) conn.release();
	}
};
