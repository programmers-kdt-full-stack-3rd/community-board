import { PoolConnection } from "mysql2/promise";
import { ICreatePostRequest, IReadPostRequest, IUpdatePostRequest } from '../../controller/posts_controller';
import pool from '../connect';
import { mapDBToPostHeaders, mapDBToPostInfo } from 'shared';
import { ServerError } from '../../middleware/errors';
import { SortBy } from "shared";

export const getPostHeaders = async ( queryString : IReadPostRequest ) => {
    let conn: PoolConnection | null = null;

    try {
        let dataValues : (number | string)[] = [];
        let countValues : (number | string)[] = [];

        let sharedSql = ` FROM posts as p
                        LEFT JOIN users as u
                        ON p.author_id = u.id
                        WHERE p.isDelete = FALSE
                        AND u.isDelete = FALSE`;
        
        let dataSql = `SELECT p.id as id, 
                            p.title as title,
                            u.nickname as author_nickname,
                            p.created_at as created_at,
                            (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) AS likes ${sharedSql}`; 

        let countSql = `SELECT COUNT(*) as total ${sharedSql}`;
        
        if (queryString.keyword){
            const keyword = `%${queryString.keyword.trim()}%`;
            dataValues.push(keyword);
            countValues.push(keyword);
            dataSql += ` AND p.title LIKE ?`;
            countSql += ` AND p.title LIKE ?`;
        }

        if (queryString.sortBy === SortBy.LIKES) {
            dataSql += ` ORDER BY likes DESC`;
        } else if (queryString.sortBy === SortBy.VIEWS) {
            dataSql += ` ORDER BY views DESC`;
        } else {
            dataSql += ` ORDER BY created_at DESC`;
        }

        dataSql += `, u.id ASC`

        dataSql += ' LIMIT ? OFFSET ?';
        dataValues.push(queryString.perPage);
        dataValues.push(queryString.index * queryString.perPage);

        // pagenation
        conn = await pool.getConnection();

        const [countRows]: any[] = await conn.query(countSql, countValues);
        const total = countRows[0].total;

        const [dataRows] : any[] = await conn.query(dataSql, dataValues);
        const postHeaders = mapDBToPostHeaders(dataRows);
        
        return {
            total,
            postHeaders
        }
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if (conn) conn.release();
    }
};

export const getPostInfo = async (post_id : number, user_id? : number) => {
    let conn : PoolConnection | null = null;

    try {
        let sql = `
                SELECT p.id, 
                        p.title,
                        p.content,
                        p.author_id,
                        u.nickname as author_nickname,
                        (p.author_id = ?) AS is_author,
                        p.created_at,
                        p.updated_at,
                        p.views,
                        (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) AS likes,
                        EXISTS(
                            SELECT *
                            FROM post_likes AS pl
                            WHERE pl.post_id = p.id AND pl.user_id = ?
                        ) AS user_liked
                FROM posts as p
                LEFT JOIN users as u
                ON p.author_id = u.id
                WHERE p.isDelete = FALSE
                AND u.isDelete = FALSE
                AND p.id = ?
        `;

        conn = await pool.getConnection();
        const [rows] : any[] = await conn.query(sql, [user_id, user_id, post_id]);

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

        let sql = `UPDATE posts SET isDelete = true WHERE id = ? and author_id = ?`;

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