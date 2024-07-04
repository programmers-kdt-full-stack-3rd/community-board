import pool from '../connect';

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