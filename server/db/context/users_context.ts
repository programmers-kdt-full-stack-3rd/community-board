import {
  FieldPacket,
  PoolConnection,
  ResultSetHeader,
  RowDataPacket,
} from "mysql2/promise";
import pool from "../connect";
import { makeHashedPassword, makeSalt } from "../../utils/crypto";
import { ServerError } from "../../middleware/errors";
import { IUser } from "../model/users";
import { makeAccessToken, makeRefreshToken } from "../../utils/token";
import { addRefreshToken } from "./token_context";

interface IUserRegData {
  email: string;
  password: string;
  nickname: string;
}

interface IUserAuthData {
  email: string;
  password: string;
}

interface IUpdateUserInfo {
  nickname: string;
  password: string;
  userId: number;
}

interface IUserAuthResult extends RowDataPacket, IUser {}

export const addUser = async (userData: IUserRegData) => {
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
    if (err.code === "ER_DUP_ENTRY") {
      throw ServerError.badRequest("이미 존재하는 이메일 주소입니다.");
    } else {
      throw err;
    }
  } finally {
    if (conn) conn.release();
  }
};

export const authUser = async (userData: IUserAuthData) => {
  let conn: PoolConnection | null = null;
  try {
    const sql = `SELECT * FROM users WHERE email = ? AND isDelete=FALSE`;
    const value = [userData.email];

    let accessToken: string;
    let refreshToken: string;

    conn = await pool.getConnection();
    const [rows]: [IUserAuthResult[], FieldPacket[]] = await conn.query(
      sql,
      value
    );

    if (rows.length === 0) {
      throw ServerError.badRequest("존재하지 않는 이메일입니다.");
    }

    const user: IUserAuthResult = rows[0];

    const hashedPassword: string = await makeHashedPassword(
      userData.password,
      user.salt
    );

    if (user.password !== hashedPassword) {
      throw ServerError.badRequest("이메일 또는 비밀번호가 틀렸습니다.");
    } else {
      accessToken = makeAccessToken(user.id);
      refreshToken = makeRefreshToken(user.id);
      await addRefreshToken(
        user.id,
        refreshToken,
        new Date(Date.now() + 1000 * 60 * 60 * 24)
      );
    }

    return { accessToken, refreshToken };
  } catch (err: any) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

export const updateUser = async (userData: IUpdateUserInfo) => {
  let conn: PoolConnection | null = null;
  try {
    const salt: string = await makeSalt();
    const hashedPassword: string = await makeHashedPassword(
      userData.password,
      salt
    );

    const sql = `UPDATE users SET nickname=?, password=?, salt=? WHERE id=? AND isDelete=FALSE `;
    const value = [userData.nickname, hashedPassword, salt, userData.userId];

    conn = await pool.getConnection();
    const [rows]: [ResultSetHeader, FieldPacket[]] = await conn.query(
      sql,
      value
    );

    if (rows.affectedRows === 0) {
      throw ServerError.badRequest("회원정보 수정 실패");
    }
  } catch (err: any) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

export const getUserById = async (userId: number) => {
  let conn: PoolConnection | null = null;
  try {
    const sql = `SELECT * FROM users WHERE id = ? AND isDelete=FALSE`;
    const value = [userId];

    conn = await pool.getConnection();
    const [rows]: [IUserAuthResult[], FieldPacket[]] = await conn.query(
      sql,
      value
    );

    if (rows.length === 0) {
      throw ServerError.badRequest("존재하지 않은 회원 입니다.");
    }

    return rows[0];
  } catch (err: any) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
};
