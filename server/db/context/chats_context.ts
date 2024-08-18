import { ServerError } from "../../middleware/errors";
import {
	FieldPacket,
	PoolConnection,
	ResultSetHeader,
	RowDataPacket,
} from "mysql2/promise";
import pool from "../connect";
import { ICreateRoomRequest } from "shared";

export const addRoom = async (userId: number, body: ICreateRoomRequest) => {
	let conn: PoolConnection | null = null;

	try {
		let sql = `INSERT INTO rooms ( name, is_private, password ) VALUES (?, ?, ?)`;
		let values = [body.title, body.isPrivate, body.password];
		conn = await pool.getConnection();
		conn.beginTransaction();

		const [insertRoomResults]: any[] = await conn.query(sql, values);

		if (insertRoomResults.affectedRows === 0) {
			conn.rollback();
			throw ServerError.reference("채팅방 생성 실패");
		}

		const roomId = insertRoomResults.insertId;

		sql = `INSERT INTO members ( id, room_id, is_host ) VALUES (?, ?, ?)`;
		values = [userId, roomId, true];

		const [insertMembersResults]: any[] = await conn.query(sql, values);

		if (insertMembersResults.affectedRows === 0) {
			conn.rollback();
			throw ServerError.reference("채팅방 생성 실패");
		}

		conn.commit();

		return roomId;
	} catch (err) {
		throw err;
	} finally {
		if (conn) conn.release();
	}
};
