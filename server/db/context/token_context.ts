import {
  FieldPacket,
  PoolConnection,
  ResultSetHeader,
  RowDataPacket,
} from "mysql2/promise";
import pool from "../connect";
import { ServerError } from "../../middleware/errors";

interface IRefreshTokenResult extends RowDataPacket {
  token: string;
}

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

export const getRefreshToken = async (user_id: number, token: string) => {
  let conn: PoolConnection | null = null;

  try {
    const sql = `SELECT token FROM refresh_tokens WHERE user_id = ? AND token = ? and expired_at > now()`;
    const value = [user_id, token];

    conn = await pool.getConnection();
    const [rows]: [IRefreshTokenResult[], FieldPacket[]] = await conn.query(
      sql,
      value
    );

    if (rows.length === 0) {
      throw ServerError.tokenError("잘못된 refresh token 입니다.");
    }
  } catch (err: any) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

export const deleteRefreshToken = async (
  user_id: number,
  refreshToken: string
) => {
  let conn: PoolConnection | null = null;

  try {
    const sql = `DELETE FROM refresh_tokens WHERE user_id = ? AND token = ?`;
    const value = [user_id, refreshToken];

    conn = await pool.getConnection();
    const [rows]: [ResultSetHeader, FieldPacket[]] = await conn.query(
      sql,
      value
    );

    if (rows.affectedRows === 0) {
      throw ServerError.reference("토큰 삭제 실패");
    }
    return rows;
  } catch (err: any) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
};
