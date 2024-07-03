const pool = require('../connect');

const addPost = async (results) => {
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

module.exports = {
    addPost
};