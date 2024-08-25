import { ServerError } from "../../middleware/errors";
import { PoolConnection } from "mysql2/promise";
import pool from "../connect";
import {
	ICreateRoomRequest,
	IMessage,
	IReadRoomRequest,
	IRoomHeader,
} from "shared";

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

		sql = `INSERT INTO members ( user_id, room_id, is_host ) VALUES (?, ?, ?)`;
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

export const getRoomsByKeyword = async (body: IReadRoomRequest) => {
	let conn: PoolConnection | null = null;

	try {
		const keyword = `%${body.keyword.trim()}%`;

		let countSql = `
				SELECT
					COUNT(*) as total
				FROM
					rooms
				WHERE
					name LIKE ?
		`;
		const values: (string | number)[] = [keyword];

		conn = await pool.getConnection();
		const [countRows]: any[] = await conn.query(countSql, values);
		const totalRoomCount = countRows[0].total;

		const dataSql = `
			SELECT
				COUNT(m.id) AS totalMembersCount,
				r.id AS roomId,
				r.name AS title,
				r.is_private AS isPrivate
			FROM
				rooms AS r
			INNER JOIN
				members AS m ON r.id = m.room_id AND m.is_deleted = FALSE AND name LIKE ?
			GROUP BY
				r.id, r.name, r.is_private
			LIMIT ? OFFSET ?
		`;

		values.push(body.perPage);
		values.push(body.page * body.perPage);

		const [dataRows]: any[] = await conn.query(dataSql, values);

		return {
			totalRoomCount,
			roomHeaders: dataRows.map(
				(data: any) =>
					({
						...data,
						isPrivate: data.isPrivate !== 0,
					}) as IRoomHeader
			),
		};
	} catch (err) {
		throw err;
	} finally {
		if (conn) conn.release();
	}
};

export const getRoomsByUserId = async (
	userId: number,
	page: number,
	perPage: number
) => {
	let conn: PoolConnection | null = null;
	try {
		let countSql = `
				SELECT
					COUNT(r.id) as total
				FROM
					members AS m
					LEFT JOIN
					rooms AS r
					ON m.room_id = r.id
				WHERE
					m.user_id = ?
		`;
		const values = [userId];

		conn = await pool.getConnection();
		const [countRows]: any[] = await conn.query(countSql, values);
		const totalRoomCount = countRows[0].total;

		const dataSql = `
			SELECT
				COUNT(m2.id) AS totalMembersCount,
				r.id AS roomId,
				r.name AS title,
				r.is_private AS isPrivate
			FROM
				rooms AS r
			INNER JOIN
				members AS m1 ON r.id = m1.room_id AND m1.is_deleted = FALSE AND m1.user_id = ?
			LEFT JOIN
				members AS m2 ON r.id = m2.room_id AND m2.is_deleted = FALSE
			GROUP BY
				r.id, r.name, r.is_private
			LIMIT ? OFFSET ?
		`;

		values.push(perPage);
		values.push(page * perPage);

		const [dataRows]: any[] = await conn.query(dataSql, values);

		return {
			totalRoomCount,
			roomHeaders: dataRows.map(
				(data: any) =>
					({
						...data,
						isPrivate: data.isPrivate !== 0,
					}) as IRoomHeader
			),
		};
	} catch (err) {
		throw err;
	} finally {
		if (conn) conn.release();
	}
};

export const enterUserToRoom = async (userId: number, roomId: number) => {
	let conn: PoolConnection | null = null;
	try {
		conn = await pool.getConnection();

		const sql = `
			SELECT
    			id AS memberId
			FROM
    			members
			WHERE
				user_id = ? AND room_id = ?
		`;
		const values = [userId, roomId];
		const [rows]: any[] = await conn.query(sql, values);

		return rows[0].memberId as number;
	} catch (err) {
		throw err;
	} finally {
		if (conn) conn.release();
	}
};

export const getMessageLogs = async (roomId: number) => {
	let conn: PoolConnection | null = null;
	try {
		conn = await pool.getConnection();

		// userId와 roomId가 일치하는 채팅방의 meesages table의 모든 데이터 가져와 주기
		// sort by create_at ASC
		const sql = `
			SELECT
    			msg.id AS id,
    			mem.id AS memberId,
    			mem.room_id AS roomId,
    			usr.nickname,
    			msg.message AS message,
    			msg.created_at AS createdAt,
    			msg.is_system AS isSystem,
    			usr.isDelete AS isDeleted
			FROM
    			rooms AS r
			INNER JOIN
				members AS mem ON r.id = mem.room_id AND r.id = ?
			INNER JOIN
    			users AS usr ON usr.id = mem.user_id
			INNER JOIN
				messages AS msg ON msg.member_id = mem.id
			ORDER BY
    			msg.created_at ASC
		`;
		const values = [roomId];
		const [rows]: any[] = await conn.query(sql, values);

		return rows.map(
			(data: any) =>
				({
					...data,
					isSystem: data.isSystem !== 0,
					isDeleted: data.isDeleted !== 0,
				}) as IMessage
		);
	} catch (err) {
		throw err;
	} finally {
		if (conn) conn.release();
	}
};

export const addUserToRoom = async (userId: number, roomId: number) => {
	let conn: PoolConnection | null = null;

	try {
		const sql = `INSERT INTO members (user_id, room_id) VALUES (?, ?)`;
		const values: (string | number | boolean)[] = [userId, roomId];
		conn = await pool.getConnection();
		const [insertMemberRows]: any[] = await conn.query(sql, values);

		if (insertMemberRows.affectedRows === 0) {
			throw ServerError.reference("가입 실패");
		}

		return roomId;
	} catch (err) {
		throw err;
	} finally {
		if (conn) conn.release();
	}
};

export const leaveRoom = async (userId: number, roomId: number) => {
	let conn: PoolConnection | null = null;
	try {
		conn = await pool.getConnection();

		let sql = `
			UPDATE members SET is_deleted = true WHERE user_id = ? and room_id = ?
		`;

		const values = [userId, roomId];
		const [rows]: any[] = await conn.query(sql, values);

		if (rows.affectedRows === 0) {
			throw ServerError.reference("탈퇴 실패");
		}

		return true;
	} catch (err) {
		console.error(err);
		throw err;
	} finally {
		if (conn) conn.release();
	}
};
