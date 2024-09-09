import {
	FieldPacket,
	PoolConnection,
	ResultSetHeader,
	RowDataPacket,
} from "mysql2/promise";
import { ServerError } from "../../middleware/errors";
import pool from "../connect";
import { mapDBToOAuthConnections } from "shared/community/oauth/oauth_mapper";
import { TOAuthProvider } from "shared";

export const readOAuthConnections = async (userId: number) => {
	let conn: PoolConnection | null = null;

	try {
		const sql = `
			SELECT
				oauth_connections.id,
				oauth_connections.user_id,
				oauth_providers.name AS oauth_provider_name,
				oauth_connections.oauth_account_id,
				oauth_connections.oauth_refresh_token
			FROM
				oauth_connections
			INNER JOIN
				oauth_providers
				ON oauth_connections.oauth_provider_id = oauth_providers.id
				AND oauth_connections.user_id = ?
				AND oauth_connections.isDelete = FALSE
		`;
		const values = [userId];

		conn = await pool.getConnection();
		const [result]: [RowDataPacket[], FieldPacket[]] = await conn.query(
			sql,
			values
		);

		return mapDBToOAuthConnections(result);
	} catch (err: any) {
		throw err;
	} finally {
		if (conn) conn.release();
	}
};

export const createOAuthConnection = async (
	provider: string,
	userId: number,
	oAuthAccountId: string,
	oAuthRefreshToken: string
) => {
	let conn: PoolConnection | null = null;

	try {
		const sql = `
			INSERT INTO
				oauth_connections (
					user_id,
					oauth_provider_id,
					oauth_account_id,
					oauth_refresh_token
				)
			SELECT
				?, id, ?, ?
			FROM
				oauth_providers
			WHERE
				name = ?
		`;
		const values = [userId, oAuthAccountId, oAuthRefreshToken, provider];

		conn = await pool.getConnection();
		const [result]: [ResultSetHeader, FieldPacket[]] = await conn.query(
			sql,
			values
		);

		if (result.affectedRows === 0) {
			throw ServerError.etcError(500, "소셜 로그인 연동에 실패했습니다.");
		}
	} catch (err: any) {
		if (err.code === "ER_DUP_ENTRY") {
			throw ServerError.badRequest("이미 연동된 소셜 계정입니다.");
		}

		throw err;
	} finally {
		if (conn) conn.release();
	}
};

export const updateOAuthRefreshToken = async (
	provider: TOAuthProvider,
	oAuthAccountId: string,
	oAuthRefreshToken: string
) => {
	let conn: PoolConnection | null = null;

	try {
		const sql = `
			UPDATE
				oauth_connections
			INNER JOIN
				oauth_providers
				ON oauth_connections.oauth_provider_id = oauth_providers.id
				AND oauth_providers.name = ?
				AND oauth_connections.oauth_account_id = ?
			SET
				oauth_connections.oauth_refresh_token = ?
		`;
		const values = [provider, oAuthAccountId, oAuthRefreshToken];

		conn = await pool.getConnection();
		const [result]: [ResultSetHeader, FieldPacket[]] = await conn.query(
			sql,
			values
		);

		if (result.affectedRows === 0) {
			console.error("OAuth Refresh token 저장 실패");
		}
	} catch (err: any) {
		if (err.code === "ER_DUP_ENTRY") {
			throw ServerError.badRequest("이미 연동된 소셜 계정입니다.");
		}

		throw err;
	} finally {
		if (conn) conn.release();
	}
};

export const deleteOAuthConnection = async (
	provider: TOAuthProvider,
	userId: number
) => {
	let conn: PoolConnection | null = null;

	try {
		const sql = `
			UPDATE
				oauth_connections
			INNER JOIN
				users
				ON oauth_connections.user_id = users.id
				AND users.id = ?
			INNER JOIN
				oauth_providers
				ON oauth_connections.oauth_provider_id = oauth_providers.id
				AND oauth_providers.name = ?
			SET
				oauth_connections.isDelete = TRUE
			WHERE
				oauth_connections.isDelete = FALSE
		`;
		const values = [userId, provider];

		conn = await pool.getConnection();
		const [result]: [ResultSetHeader, FieldPacket[]] = await conn.query(
			sql,
			values
		);

		if (result.affectedRows === 0) {
			throw ServerError.reference("소셜 로그인 개별 연동 해제 실패");
		}
	} catch (err) {
		throw err;
	} finally {
		if (conn) conn.release();
	}
};

export const clearOAuthConnection = async (userId: number) => {
	let conn: PoolConnection | null = null;

	try {
		const sql = `
			UPDATE
				oauth_connections
			SET
				oauth_refresh_token = NULL,
				isDelete = TRUE
			WHERE
				user_id = ?
		`;
		const values = [userId];

		conn = await pool.getConnection();
		const [result]: [ResultSetHeader, FieldPacket[]] = await conn.query(
			sql,
			values
		);

		if (result.affectedRows === 0) {
			throw ServerError.reference("소셜 로그인 전체 연동 해제 실패");
		}
	} catch (err) {
		throw err;
	} finally {
		if (conn) conn.release();
	}
};
