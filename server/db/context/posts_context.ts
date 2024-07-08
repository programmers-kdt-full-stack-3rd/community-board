import { PoolConnection } from "mysql2/promise";
import { ICreatePostRequest, IReadPostRequest } from '../../controller/posts_controller';
import pool from '../connect';
import { mapDBToPostHeaders, mapDBToPostInfo } from '../mapper/posts_mapper';
import { ServerError } from '../../middleware/errors';

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

export const getPostHeaders = async ( queryString : IReadPostRequest ) => {
    let conn: PoolConnection | null = null;

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

export const getPostInfo = async (post_id : number) => {
    let conn : PoolConnection | null = null;

    try {
        let sql = `
                SELECT p.id, 
                        p.title,
                        p.content,
                        p.author_id,
                        u.nickname as author_nickname,
                        p.created_at,
                        p.updated_at,
                        p.views,
                        (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) AS likes
                FROM posts as p
                LEFT JOIN users as u
                ON p.author_id = u.id
                WHERE p.isDelete = FALSE
                AND u.isDelete = FALSE
                AND p.id = ?
        `;

        conn = await pool.getConnection();
        const [rows] : any[] = await conn.query(sql, [post_id]);

        if(rows.length === 0) {
            throw ServerError.notFound("존재하지 않는 게시글입니다.");
        }

        return mapDBToPostInfo(rows[0]);
        
    } catch (err){
        throw err;
    }
};