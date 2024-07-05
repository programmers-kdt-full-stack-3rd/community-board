import { IPostRequest } from '../../controller/posts_controller';
import pool from '../connect';
import { mapDBToPostHeaders } from '../mapper/posts_mapper';

export const addPost = async (values : any) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const sql = `INSERT INTO users (email, nickname, password, salt) VALUES (?, ?, ?, ?)`;
        const [results] = await conn.query(sql, values);
        return results;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release();
    }
};

export const getPostHeaders = async ( queryString : IPostRequest ) => {
    let conn;
    try {
        let values : (number | string)[] = [];

        let sql = `SELECT p.id as id, 
                            p.title as title,
                            u.nickname as author_nickname,
                            p.created_at as created_at,
                            (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) AS likes
                        FROM posts as p
                        LEFT JOIN users as u
                        ON p.author_id = u.id
                        WHERE p.isDelete = FALSE
                        AND u.isDelete = FALSE`;
        
        if (queryString.keyword !== null){
            values.push(`%${queryString.keyword}%`);
            sql += ` AND p.content LIKE ?`
        }

        sql += ' LIMIT ? OFFSET ?;';
        values.push(queryString.perPage);
        values.push(queryString.index * queryString.perPage);

        conn = await pool.getConnection();
        const [rows] : any[] = await conn.query(sql, values);
        return mapDBToPostHeaders(rows);
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release();
    }
};

