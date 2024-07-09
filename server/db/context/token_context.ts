import { FieldPacket, PoolConnection, ResultSetHeader } from "mysql2/promise";
import pool from "../connect";
import { ServerError } from "../../middleware/errors";

export const addRefreshToken = async (
  user_id: number,
  token: string,
  expired_at: Date
) => {
  let conn: PoolConnection | null = null;

  try {
    const sql = `INSERT INTO refresh_tokens (user_id,token,expired_at) VALUES (?,?,?)`;
    const value = [user_id, token, expired_at];

    conn = await pool.getConnection();
    const [rows]: [ResultSetHeader, FieldPacket[]] = await conn.query(
      sql,
      value
    );

    if (rows.affectedRows === 0) {
      throw ServerError.reference("토큰 저장 실패");
    }
    return rows;
  } catch (err: any) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
};
