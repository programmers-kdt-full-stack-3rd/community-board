import { mapDBToComments } from "shared";
import {
	FieldPacket,
	PoolConnection,
	ResultSetHeader,
	RowDataPacket,
} from "mysql2/promise";
import { ServerError } from "../../middleware/errors";
import pool from "../connect";

interface ICommentInsertion {
	post_id: number;
	author_id: number;
	content: string;
}

interface ICommentUpdate {
	id: number;
	author_id: number;
	content: string;
}

interface ICommentDelete {
	id: number;
	author_id: number;
}

export const getTotalComments = async (postId: number) => {
	let conn: PoolConnection | null = null;

	try {
		const sql = `
      SELECT
        COUNT(*) AS total
      FROM
        comments
      INNER JOIN
        posts
        ON comments.post_id = posts.id
        AND comments.post_id = ?
      INNER JOIN
        users
        ON comments.author_id = users.id
      WHERE
        comments.is_delete = FALSE
        AND users.is_delete = FALSE
    `;
		const values = [postId];

		conn = await pool.getConnection();
		const [rows]: [RowDataPacket[], FieldPacket[]] = await conn.query(
			sql,
			values
		);

		return {
			total: Number(rows[0]?.total) || 0,
		};
	} catch (err) {
		throw err;
	} finally {
		if (conn) conn.release();
	}
};

export const readComments = async (
	postId: number,
	index: number,
	perPage: number,
	userId?: number
) => {
	let conn: PoolConnection | null = null;

	try {
		const sql = `
      SELECT
        comments.id AS id,
        comments.content AS content,
        comments.author_id AS author_id,
        users.nickname AS author_nickname,
        (comments.author_id = ?) AS is_author,
        comments.created_at AS created_at,
        comments.updated_at AS updated_at,
        (SELECT COUNT(*) FROM comment_likes WHERE comment_id = comments.id) AS likes,
        EXISTS(
          SELECT *
          FROM comment_likes
          WHERE comment_likes.comment_id = comments.id
            AND comment_likes.user_id = ?
        ) AS user_liked
      FROM
        comments
      INNER JOIN
        posts
        ON comments.post_id = posts.id
        AND comments.post_id = ?
      INNER JOIN
        users
        ON comments.author_id = users.id
      WHERE
        comments.is_delete = FALSE
        AND users.is_delete = FALSE
      ORDER BY
        comments.created_at,
        comments.id
      LIMIT ? OFFSET ?
    `;
		const values = [userId, userId, postId, perPage, index * perPage];

		conn = await pool.getConnection();
		const [rows]: [RowDataPacket[], FieldPacket[]] = await conn.query(
			sql,
			values
		);

		return {
			comments: mapDBToComments(rows),
		};
	} catch (err) {
		throw err;
	} finally {
		if (conn) conn.release();
	}
};

export const createComment = async (
	commentInsertion: ICommentInsertion,
	conn: PoolConnection
) => {
	const { post_id, author_id, content } = commentInsertion;

	try {
		const sql = `
      INSERT INTO
        comments (post_id, author_id, content)
      VALUES
        (?, ?, ?)
    `;
		const values = [post_id, author_id, content];
		const [result]: [ResultSetHeader, FieldPacket[]] = await conn.query(
			sql,
			values
		);

		if (result.affectedRows === 0) {
			throw ServerError.etcError(500, "댓글을 등록하지 못했습니다.");
		}
	} catch (err: any) {
		if (
			err?.code === "ER_NO_REFERENCED_ROW_2" &&
			err?.sqlMessage?.includes("post_id")
		) {
			throw ServerError.notFound("게시글 ID가 존재하지 않습니다.");
		}

		throw err;
	}
};

export const updateComment = async (commentUpdate: ICommentUpdate) => {
	let conn: PoolConnection | null = null;

	const { id, author_id, content } = commentUpdate;

	try {
		const sql = `
      UPDATE
        comments
      SET
        content = ?
      WHERE
        id = ?
        AND author_id = ?
        AND is_delete = FALSE
    `;
		const values = [content, id, author_id];

		conn = await pool.getConnection();
		const [result]: [ResultSetHeader, FieldPacket[]] = await conn.query(
			sql,
			values
		);

		if (result.affectedRows === 0) {
			// 실패하는 상황
			// - 존재하지 않는 댓글: 댓글 ID가 일치하는 레코드가 없음
			// - 다른 사람의 댓글: 댓글의 작성자 ID가 일치하지 않음
			// - 이미 삭제된 댓글: isDelete 컬럼이 TRUE
			throw ServerError.reference("댓글 수정 실패");
		}
	} catch (err) {
		throw err;
	} finally {
		if (conn) conn.release();
	}
};

export const deleteComment = async (commentDelete: ICommentDelete) => {
	let conn: PoolConnection | null = null;

	const { id, author_id } = commentDelete;

	try {
		const sql = `
      UPDATE
        comments
      SET
        is_delete = TRUE
      WHERE
        id = ?
        AND author_id = ?
        AND is_delete = FALSE
    `;
		const values = [id, author_id];

		conn = await pool.getConnection();
		const [result]: [ResultSetHeader, FieldPacket[]] = await conn.query(
			sql,
			values
		);

		if (result.affectedRows === 0) {
			// 실패하는 상황
			// - 존재하지 않는 댓글: 댓글 ID가 일치하는 레코드가 없음
			// - 다른 사람의 댓글: 댓글의 작성자 ID가 일치하지 않음
			// - 이미 삭제된 댓글: isDelete 컬럼이 TRUE
			throw ServerError.reference("댓글 삭제 실패");
		}
	} catch (err) {
		throw err;
	} finally {
		if (conn) conn.release();
	}
};
