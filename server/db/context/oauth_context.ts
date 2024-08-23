import { FieldPacket, PoolConnection, ResultSetHeader } from "mysql2/promise";
import { ServerError } from "../../middleware/errors";
import pool from "../connect";
import { TOAuthProvider } from "../model/oauth";

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
