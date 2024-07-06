import { PoolConnection } from "mysql2/promise";
import pool from "../connect";
import { mapDBToComments } from "../mapper/comments_mapper";

export const getComments = async (postId: number) => {
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
