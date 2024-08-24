import { FieldPacket, PoolConnection, ResultSetHeader } from "mysql2/promise";
import { IKafkaMessageDTO } from "shared";

import { getDBPool } from "../config/dbConfig";

// insert message
const insertMessage = async (messageDTO: IKafkaMessageDTO): Promise<number> => {
	let conn: PoolConnection | null = null;

	const { memberId, message, createdAt, isSystem } = messageDTO;
	const values = [memberId, message, createdAt, isSystem];

	const query = `
    INSERT INTO messages (member_id,  message, created_at, is_system)
    VALUES (?, ?, ?, ?)
    `;

	try {
		const pool = getDBPool();

		conn = await pool.getConnection();

		const [result]: [ResultSetHeader, FieldPacket[]] = await conn.query(
			query,
			values
		);

		if (result.affectedRows === 0) {
			throw new Error("메시지가 저장되지 않았습니다.");
		}

		return result.insertId;
	} catch (error) {
		throw error;
	} finally {
		if (conn !== null) conn.release();
	}
};

export { insertMessage };
