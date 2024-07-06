import { FieldPacket, PoolConnection, ResultSetHeader } from "mysql2/promise";
import pool from "../connect";
import { makeHashedPassword, makeSalt } from "../../utils/crypto";

interface IUser {
  email: string;
  password: string;
  nickname: string;
}

export const addUser = async (userData: IUser) => {
  let conn: PoolConnection | null = null;
  try {
    const salt: string = await makeSalt();
    const hashedPassword: string = await makeHashedPassword(
      userData.password,
      salt
    );

    const sql = `INSERT INTO users (email, nickname, password, salt) VALUES (?, ?, ?, ?)`;
    const value = [userData.email, userData.nickname, hashedPassword, salt];

    conn = await pool.getConnection();
    const [rows]: [ResultSetHeader, FieldPacket[]] = await conn.query(
      sql,
      value
    );

    return rows;
  } catch (err: any) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
};
