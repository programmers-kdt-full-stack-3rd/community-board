import { FieldPacket, PoolConnection, ResultSetHeader } from "mysql2/promise";
import { ServerError } from "../../middleware/errors";
import pool from "../connect";
import { likeTargetToName } from "../mapper/likes_mapper";
import { TLikeTarget } from "../model/likes";

export const createLike = async <T extends TLikeTarget>(
	targetType: T,
	targetId: number,
	userId: number
) => {
	const targetTypeName = likeTargetToName[targetType];
	let conn: PoolConnection | null = null;

	try {
		const sql = `
      INSERT INTO
        ${targetType}_likes (${targetType}_id, user_id)
      VALUES
        (?, ?)
    `;
		const values = [targetId, userId];

		conn = await pool.getConnection();
		const [result]: [ResultSetHeader, FieldPacket[]] = await conn.query(
			sql,
			values
		);

		if (result.affectedRows === 0) {
			throw ServerError.etcError(500, `${targetTypeName} 좋아요 실패`);
		}
	} catch (err: any) {
		if (err?.code === "ER_DUP_ENTRY") {
			throw ServerError.badRequest(
				`이미 좋아요 표시한 ${targetTypeName}입니다.`
			);
		} else if (
			err?.code === "ER_NO_REFERENCED_ROW_2" &&
			err?.sqlMessage?.includes(`${targetType}_id`)
		) {
			throw ServerError.notFound(
				`${targetTypeName} ID가 존재하지 않습니다.`
			);
		}

		throw err;
	} finally {
		if (conn) conn.release();
	}
};

export const deleteLike = async <T extends TLikeTarget>(
	targetType: T,
	targetId: number,
	userId: number
) => {
	const targetTypeName = likeTargetToName[targetType];
	let conn: PoolConnection | null = null;

	try {
		const sql = `
      DELETE
      FROM
        ${targetType}_likes
      WHERE
        ${targetType}_id = ?
        AND user_id = ?
    `;
		const values = [targetId, userId];

		conn = await pool.getConnection();
		const [result]: [ResultSetHeader, FieldPacket[]] = await conn.query(
			sql,
			values
		);

		if (result.affectedRows === 0) {
			// 실패하는 상황
			// - 존재하지 않는 target: target ID가 일치하는 레코드가 없음
			// - target에 좋아요를 하지 않은 상태
			throw ServerError.reference(`${targetTypeName} 좋아요 취소 실패`);
		}
	} catch (err) {
		throw err;
	} finally {
		if (conn) conn.release();
	}
};
