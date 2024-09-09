import {
	FieldPacket,
	PoolConnection,
	ResultSetHeader,
	RowDataPacket,
} from "mysql2/promise";
import pool from "../connect";
import { makeHashedPassword, makeSalt } from "../../utils/crypto";
import { ServerError } from "../../middleware/errors";
import {
	IGetUsersInfoParams,
	IUser,
	IUserInfoRow,
	IPermissionRow,
	IRoleRow,
	mapDBToPartialUser,
} from "shared";
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
	email?: string;
	nickname: string;
	password: string;
	userId: number;
}

type TDeleteUserInfo =
	| { email: string; userId?: never }
	| { email?: never; userId: number };

interface IUserAuthResult extends RowDataPacket, IUser {}

const handleDupEntry = async (sqlMessage: string, email: string) => {
	if (sqlMessage.includes("email")) {
		const isDelete = await isUserDeleted({ email });
		if (isDelete) {
			throw ServerError.badRequest("탈퇴한 회원의 이메일입니다.");
		}
		throw ServerError.badRequest("이미 존재하는 이메일 주소입니다.");
	}

	if (sqlMessage.includes("nickname")) {
		throw ServerError.badRequest("이미 사용 중인 닉네임입니다.");
	}
};

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

		if (rows.affectedRows === 0) {
			throw ServerError.reference("회원가입 실패");
		}

		return rows;
	} catch (err: any) {
		if (err.code === "ER_DUP_ENTRY") {
			handleDupEntry(err.sqlMessage as string, userData.email);
		}

		throw err;
	} finally {
		if (conn) conn.release();
	}
};

/**
 * @returns 추가된 레코드의 id 컬럼 값
 */
export const addOAuthUser = async (nickname: string) => {
	let conn: PoolConnection | null = null;
	try {
		const sql = `INSERT INTO users (nickname) VALUES (?)`;
		const value = [nickname];

		conn = await pool.getConnection();
		const [rows]: [ResultSetHeader, FieldPacket[]] = await conn.query(
			sql,
			value
		);

		if (rows.affectedRows === 0) {
			throw ServerError.etcError(500, "소셜 로그인으로 회원가입 실패");
		}

		return rows.insertId;
	} catch (err: any) {
		if (err.code === "ER_DUP_ENTRY") {
			throw ServerError.reference("이미 사용 중인 닉네임입니다.");
		}

		throw err;
	} finally {
		if (conn) conn.release();
	}
};

/**
 * @param provider - OAuth 서비스 제공자
 * @param oAuthAccountId - OAuth access token으로 얻은 회원 정보상의 고유번호
 * @returns 주어진 소셜 계정으로 연동한 이력이 없으면 `null`, 연동한 활성 회원이
 *          있으면 해당 회원 정보(`Partial<IUser>`)
 */
export const readUserByOAuth = async (
	provider: string,
	oAuthAccountId: string
) => {
	let conn: PoolConnection | null = null;
	try {
		const sql = `
			SELECT
				users.id,
				users.email,
				users.nickname,
				users.isDelete
			FROM
				users
			INNER JOIN
				oauth_connections
				ON oauth_connections.user_id = users.id
				AND oauth_connections.oauth_account_id = ?
			INNER JOIN
				oauth_providers
				ON oauth_providers.id = oauth_connections.oauth_provider_id
				AND oauth_providers.name = ?
		`;
		const value = [oAuthAccountId, provider];

		conn = await pool.getConnection();
		const [rows]: [RowDataPacket[], FieldPacket[]] = await conn.query(
			sql,
			value
		);

		if (rows.length === 0) {
			return null;
		}

		const user: Partial<IUser> = mapDBToPartialUser(rows[0]);

		if (user.isDelete) {
			throw ServerError.badRequest("탈퇴한 회원입니다.");
		}

		return user;
	} catch (err: any) {
		throw err;
	} finally {
		if (conn) conn.release();
	}
};

export const authUser = async (userData: IUserAuthData) => {
	let conn: PoolConnection | null = null;
	try {
		const sql = `SELECT * FROM users WHERE email = ?`;
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

		if (user.isDelete) {
			throw ServerError.badRequest("탈퇴한 회원입니다.");
		}

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

		return { user, accessToken, refreshToken };
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
		const value = [
			userData.nickname,
			hashedPassword,
			salt,
			userData.userId,
		];

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

export const registerUserEmail = async (userData: IUpdateUserInfo) => {
	if (!userData.email) {
		throw ServerError.etcError(
			500,
			"서버 로직에서 필수 정보를 누락했습니다."
		);
	}

	let conn: PoolConnection | null = null;
	try {
		const salt: string = await makeSalt();
		const hashedPassword: string = await makeHashedPassword(
			userData.password,
			salt
		);

		const sql = `
			UPDATE
				users
			SET
				email = ?,
				nickname = ?,
				password = ?,
				salt = ?
			WHERE
				id = ?
				AND isDelete = FALSE
		`;
		const value = [
			userData.email,
			userData.nickname,
			hashedPassword,
			salt,
			userData.userId,
		];

		conn = await pool.getConnection();
		const [rows]: [ResultSetHeader, FieldPacket[]] = await conn.query(
			sql,
			value
		);

		if (rows.affectedRows === 0) {
			throw ServerError.badRequest(
				"소셜 로그인으로 가입한 회원 정보에 이메일 등록 실패"
			);
		}
	} catch (err: any) {
		if (err.code === "ER_DUP_ENTRY") {
			await handleDupEntry(err.sqlMessage as string, userData.email);
		}

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

export const getUsersInfo = async ({
	index,
	perPage,
	nickname,
	email,
}: IGetUsersInfoParams) => {
	let conn: PoolConnection | null = null;
	try {
		let sql = `SELECT COUNT(*) OVER() as total ,u.id, u.email, u.nickname, u.created_at, u.isDelete,
		(SELECT COUNT(id) FROM comments WHERE author_id = u.id) as comment_count,
		(SELECT COUNT(id) FROM posts WHERE author_id = u.id) as post_count 
		FROM users u 
		`;

		const value = [];

		if (nickname || email) {
			sql += `WHERE `;
		}

		if (nickname) {
			sql += `u.nickname LIKE ? `;
			value.push(`%${nickname}%`);

			if (email) {
				sql += `AND `;
			}
		}

		if (email) {
			sql += `u.email LIKE ? `;
			value.push(`%${email}%`);
		}

		sql += `ORDER BY u.id ASC`;

		const pagenationSQL = ` LIMIT ? OFFSET ?`;

		sql += pagenationSQL;
		value.push(perPage);
		value.push(index * perPage);

		conn = await pool.getConnection();
		const [rows]: [IUserInfoRow[], FieldPacket[]] = await conn.query(
			sql,
			value
		);

		if (rows.length === 0) {
			throw ServerError.badRequest("유저가 존재하지 않습니다");
		}

		return rows;
	} catch (err: any) {
		throw err;
	} finally {
		if (conn) conn.release();
	}
};

export const deleteUser = async (userId: number) => {
	let conn: PoolConnection | null = null;
	try {
		const sql = `UPDATE users SET isDelete=TRUE WHERE id=? AND isDelete=FALSE`;
		const value = [userId];

		conn = await pool.getConnection();
		const [rows]: [ResultSetHeader, FieldPacket[]] = await conn.query(
			sql,
			value
		);

		if (rows.affectedRows === 0) {
			throw ServerError.badRequest("회원 탈퇴 실패");
		}
	} catch (err: any) {
		throw err;
	} finally {
		if (conn) conn.release();
	}
};

export const restoreUser = async (userId: number) => {
	let conn: PoolConnection | null = null;
	try {
		const sql = `UPDATE users SET isDelete=FALSE WHERE id=? AND isDelete=TRUE`;
		const value = [userId];

		conn = await pool.getConnection();
		const [rows]: [ResultSetHeader, FieldPacket[]] = await conn.query(
			sql,
			value
		);

		if (rows.affectedRows === 0) {
			throw ServerError.badRequest("회원 복구 실패");
		}
	} catch (err: any) {
		throw err;
	} finally {
		if (conn) conn.release();
	}
};

export const isUserDeleted = async (params: TDeleteUserInfo) => {
	const { email, userId } = params;
	let conn: PoolConnection | null = null;
	try {
		let sql = `SELECT * FROM users WHERE isDelete = true`;
		let value: (string | number)[] = [];
		if (email) {
			sql += ` AND email = ?`;
			value = [email];
		} else if (userId) {
			sql += ` AND id = ?`;
			value = [userId];
		}
		conn = await pool.getConnection();
		const [rows]: [RowDataPacket[], FieldPacket[]] = await conn.query(
			sql,
			value
		);

		return rows.length > 0;
	} catch (err: any) {
		throw err;
	} finally {
		if (conn) conn.release();
	}
};

export const getUserRole = async (userId: number) => {
	let conn: PoolConnection | null = null;
	try {
		const sql = `SELECT r.id AS role_id, r.name AS role_name
		FROM users u
		LEFT JOIN roles r ON u.role_id = r.id
		WHERE u.id = ?`;
		const value = [userId];

		conn = await pool.getConnection();
		const [rows]: [IRoleRow[], FieldPacket[]] = await conn.query(
			sql,
			value
		);

		if (rows.length === 0) {
			throw ServerError.badRequest("Role을 찾을 수 없습니다.");
		}

		return rows[0];
	} catch (err: any) {
		throw err;
	} finally {
		if (conn) conn.release();
	}
};

export const getUserPermission = async (userId: number) => {
	let conn: PoolConnection | null = null;
	try {
		const sql = `SELECT DISTINCT p.id AS permission_id, p.name AS permission_name
		FROM users u
		INNER JOIN role_permission rp ON u.role_id = rp.role_id
		INNER JOIN permissions p ON rp.permission_id = p.id
		WHERE u.id = ?`;
		const value = [userId];

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
