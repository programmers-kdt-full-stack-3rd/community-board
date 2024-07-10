import { FieldPacket, PoolConnection, ResultSetHeader } from "mysql2/promise";
import { ServerError } from "../../middleware/errors";
import pool from "../connect";
import { mapDBToComments } from "../mapper/comments_mapper";

interface ICommentInsertion {
  post_id: number;
  author_id: number;
  content: string;
}

export const readComments = async (postId: number) => {
  let conn: PoolConnection | null = null;

  try {
    const sql = `
      SELECT
        comments.id as id,
        comments.content as content,
        comments.author_id as author_id,
        users.nickname as author_nickname,
        comments.created_at as created_at,
        comments.updated_at as updated_at,
        (SELECT COUNT(*) FROM comment_likes WHERE comment_id = comments.id) AS likes
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
        comments.isDelete = FALSE
        AND users.isDelete = FALSE
    `;
    const values = [postId];

    conn = await pool.getConnection();
    const [rows]: any[] = await conn.query(sql, values);
    return mapDBToComments(rows);
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

export const createComment = async (commentInsertion: ICommentInsertion) => {
  let conn: PoolConnection | null = null;

  const { post_id, author_id, content } = commentInsertion;

  try {
    const sql = `
      INSERT INTO
        comments (post_id, author_id, content)
      VALUES
        (?, ?, ?)
    `;
    const values = [post_id, author_id, content];

    conn = await pool.getConnection();
    const [result]: [ResultSetHeader, FieldPacket[]] = await conn.query(
      sql,
      values
    );

    if (result.affectedRows === 0) {
      throw ServerError.etcError(500, "댓글을 등록하지 못했습니다.");
    }
  } catch (err: any) {
    if (err?.code === "ER_NO_REFERENCED_ROW_2") {
      const notFoundFields = [
        { fieldDesc: "작성자 ID", columnName: "author_id" },
        { fieldDesc: "게시글 ID", columnName: "post_id" },
      ];

      for (const field of notFoundFields) {
        if (err?.sqlMessage?.includes(field.columnName)) {
          throw ServerError.notFound(
            `${field.fieldDesc} ${field.columnName}이(가) 존재하지 않습니다.`
          );
        }
      }
    } else if (
      err?.code === "ER_BAD_NULL_ERROR" &&
      (author_id === undefined || author_id === null)
    ) {
      throw ServerError.badRequest("작성자 ID가 필요합니다.");
    } else if (
      err?.code === "ER_TRUNCATED_WRONG_VALUE_FOR_FIELD" &&
      typeof author_id !== "number"
    ) {
      throw ServerError.badRequest("작성자 ID의 자료형은 number이어야 합니다.");
    }

    throw err;
  } finally {
    if (conn) conn.release();
  }
};
