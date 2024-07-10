import { PoolConnection } from "mysql2/promise";
import { ICreatePostRequest, IReadPostRequest, IUpdatePostRequest } from '../../controller/posts_controller';
import pool from '../connect';
import { mapDBToPostHeaders, mapDBToPostInfo } from '../mapper/posts_mapper';
import { ServerError } from '../../middleware/errors';

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
    } finally {
        if (conn) conn.release();
    }
};

export const addPost = async (reqBody : ICreatePostRequest) => {
    let conn : PoolConnection | null = null;

    try {
        const values : [string, string, number] = [reqBody.title, reqBody.content, reqBody.author_id];

        let sql = `
                INSERT INTO posts (title, content, author_id, created_at)
                VALUES (?, ?, ?, now())
        `;

        conn = await pool.getConnection();
        const [rows] : any[] = await conn.query(sql, values);
        
        if (rows.affectedRows === 0) {
            throw ServerError.reference("게시글 작성 실패");
        }

        // 게시글 작성에 성공했을 때, client에 반환할 값이 없기 때문에
        // 불필요한 return 제외
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release();
    }
};

export const updatePost = async (post_id : number, reqBody : IUpdatePostRequest) => {
    let conn: PoolConnection | null = null;

    try {
        let values : (number | string)[] = [];

        let sql = `
                UPDATE posts
                SET
        `;

        if (reqBody.title){
            values.push(reqBody.title);
            sql += ' title = ?'
        }

        if (reqBody.content){
            values.push(reqBody.content);

            if (values.length > 0) {
                sql += `,`;
            }

            sql += ' content = ?'
        }

        values.push(post_id);
        values.push(reqBody.author_id);
        sql += ` WHERE id = ? AND author_id = ? AND isDelete = FALSE`;

        conn = await pool.getConnection();
        const [rows] : any[] = await conn.query(sql, values);
        
        if (rows.affectedRows === 0) {
            // 1. 게시글 author_id와 수정 요청한 user_id가 다름 -> client에서 막아야 함
            // 2. 원인모를 이유로 실패함
            throw ServerError.reference("게시글 수정 실패");
        }
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release();
    }
};

export const deletePost = async (post_id : number, user_id : number) => {
    let conn: PoolConnection | null = null;

    try {
        let values : number[] = [post_id, user_id];

        let sql = `DELETE FROM posts WHERE id = ? and author_id = ?`;

        conn = await pool.getConnection();
        const [rows] : any[] = await conn.query(sql, values);
        
        if (rows.affectedRows === 0) {
            // 1. 게시글 author_id와 수정 요청한 user_id가 다름 -> client에서 막아야 함
            // 2. 원인모를 이유로 실패함
            throw ServerError.reference("게시글 삭제 실패");
        }
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if (conn) conn.release();
    }
};