import { FieldPacket, PoolConnection, ResultSetHeader } from "mysql2/promise";
import pool from "../connect";
import crypto from "crypto";

interface IUser {
  email: string;
  password: string;
  nickname: string;
}

const makeSalt = (): Promise<string> =>
  new Promise((resolve, reject) => {
    crypto.randomBytes(64, (err, buf) => {
      if (err) {
        reject(err);
      }
      resolve(buf.toString("base64"));
    });
  });

const makeHashedPassword = async (
  password: string,
  salt: string
): Promise<string> =>
  new Promise(async (resolve, reject) => {
    crypto.pbkdf2(password, salt, 100000, 64, "sha512", (err, key) => {
      if (err) {
        reject(err);
      }
      resolve(key.toString("base64"));
    });
  });

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
